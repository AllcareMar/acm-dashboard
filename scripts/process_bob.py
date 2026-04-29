"""
Process a new BOB file and regenerate the dashboard data.

This is the core logic that:
1. Reads the new BOB file (detects header row, sheet)
2. Appends to the historical snapshots archive
3. Recalculates RETENTION_DATA (global, by agency, by state, tenure)
4. Recalculates BOB data for county map, zip heatmap, agents, plans
5. Injects updated data into the JSX dashboard file

Writes to:
- data/snapshots_master.pkl       (historical snapshots cache)
- data/retention_data.json        (retention calcs)
- imo-uhc-dashboard.jsx           (updated with new data)
"""

import os
import re
import json
import pickle
from pathlib import Path
from datetime import datetime
import pandas as pd
import warnings
warnings.filterwarnings('ignore')


ROOT = Path(__file__).parent.parent
DATA_DIR = ROOT / 'data'
DATA_DIR.mkdir(exist_ok=True)
DASHBOARD_JSX = ROOT / 'imo-uhc-dashboard.jsx'

# Mapping from raw agency names (from gaName30/mgaName40/fmoName50) to short names used in dashboard
AGENCY_SHORT = {
    'ALLCARE MAR AGENCY LLC': 'AllCare Mar',
    'CONCEP CARE INSURANCE AGENCY,': 'Concep Care',
    'GW INS GROUP LLC': 'GW Ins Group',
    'SIMAROVA SENIOR SOLUTIONS LLC DBA SIMAROVA SENIOR INSURANCE SOLUTIONS': 'Simarova Senior',
    'KMRA GROUP, LLC': 'KMRA Group',
    'MARTELL MULTI SERVICE LLC': 'Martell Multi',
    'TCS & ASSOCIATES LLC': 'TCS & Associates',
    'AMC CARE GROUP LLC,': 'AMC Care Group',
    'TOP TIER HEALTH CONSULTANTS LLC': 'Top Tier Health',
    'JPM SOLUTIONS': 'JPM Solutions',
    'ORIGIN INSURANCE GROUP LLC': 'Origin Insurance',
    'GANDHI, MANISH': 'Gandhi, Manish',
    'MANISH GANDHI INSURANCE AGENCY LLC': 'Gandhi, Manish',
    'NEXTGEN HEALTH AGENCY LLC': 'NextGen Health',
}

NEEDED_COLS = ['mbiNumber', 'policyEffectiveDate', 'product', 'memberState',
               'memberCounty', 'agentName', 'planStatus', 'policyTermDate',
               'termReasonCode', 'planName',
               'gaName30', 'mgaName40', 'fmoName50']


def detect_sheet_and_header(filepath):
    """Auto-detect sheet and header row for a BOB file."""
    xl = pd.ExcelFile(filepath)
    sheet = 'AgencyFinal' if 'AgencyFinal' in xl.sheet_names else 'BOB Sheet'
    raw = pd.read_excel(filepath, sheet_name=sheet, header=None, nrows=10)
    for row_idx in range(len(raw)):
        row_vals = [str(v).strip() if pd.notna(v) else '' for v in raw.iloc[row_idx].values]
        if 'mbiNumber' in row_vals and 'policyEffectiveDate' in row_vals:
            return sheet, row_idx
    raise ValueError(f'Could not detect header row in {filepath}')


def derive_agency(row):
    """Apply Waldo's rule: gaName30 || mgaName40 || fmoName50"""
    for col in ['gaName30', 'mgaName40', 'fmoName50']:
        val = row.get(col)
        if pd.notna(val) and str(val).strip() and str(val).strip().lower() not in ['nan', 'none', '']:
            return str(val).strip()
    return 'Unknown'


def read_bob_file(filepath, snapshot_date):
    """Read a BOB file and return normalized DataFrame."""
    sheet, header = detect_sheet_and_header(filepath)
    df_full = pd.read_excel(filepath, sheet_name=sheet, header=header)

    # Validate required columns
    required = ['mbiNumber', 'policyEffectiveDate']
    missing_required = [c for c in required if c not in df_full.columns]
    if missing_required:
        raise ValueError(f'Required columns missing: {missing_required}')

    avail = [c for c in NEEDED_COLS if c in df_full.columns]
    df = df_full[avail].copy()

    for c in ['gaName30', 'mgaName40', 'fmoName50']:
        if c not in df.columns:
            df[c] = pd.NA

    df['snapshot_date'] = snapshot_date
    df['snapshot_file'] = os.path.basename(filepath)
    df = df[df['mbiNumber'].notna()].copy()
    df['mbiNumber'] = df['mbiNumber'].astype(str).str.strip()

    df['policyEffectiveDate'] = pd.to_datetime(df['policyEffectiveDate'], errors='coerce')
    if 'policyTermDate' in df.columns:
        df['policyTermDate'] = pd.to_datetime(df['policyTermDate'], errors='coerce')

    for c in ['gaName30', 'mgaName40', 'fmoName50']:
        df[c] = df[c].astype(str).str.strip().replace(['nan', 'None', ''], pd.NA)

    df['agency_raw'] = df.apply(derive_agency, axis=1)
    df['agency_short'] = df['agency_raw'].map(AGENCY_SHORT).fillna(df['agency_raw'])

    # policy_id = unique policy identifier (mbi + product)
    # This allows counting policies, not members. A member with MA + PDP = 2 policies.
    if 'product' in df.columns:
        df['policy_id'] = df['mbiNumber'].astype(str) + '|' + df['product'].astype(str)
    else:
        df['policy_id'] = df['mbiNumber'].astype(str) + '|UNKNOWN'

    return df


def load_master_snapshots():
    """Load the master historical snapshots pickle (gzip compressed)."""
    master_path = DATA_DIR / 'snapshots_master.pkl'
    if not master_path.exists():
        raise FileNotFoundError(
            f'Master snapshots file not found at {master_path}. '
            f'Run setup_initial_data.py first to bootstrap historical data.'
        )
    return pd.read_pickle(master_path, compression='gzip')


def save_master_snapshots(df):
    """Save master pickle with gzip compression (reduces size ~9x)."""
    # Convert repetitive string columns to category for size reduction
    cat_cols = ['product', 'memberState', 'memberCounty', 'agentName', 'planStatus',
                'termReasonCode', 'planName', 'gaName30', 'mgaName40', 'fmoName50',
                'snapshot_file', 'agency_raw', 'agency_short']
    for col in cat_cols:
        if col in df.columns and df[col].dtype != 'category':
            df[col] = df[col].astype('category')
    df.to_pickle(DATA_DIR / 'snapshots_master.pkl', compression='gzip')


def calculate_retention_data(df):
    """Calculate retention metrics using policy_id (mbi|product) as unit.
    Counts POLICIES, not unique members. A member with MA + PDP counts as 2 policies.
    """
    # Deduplicate by (policy_id, snapshot_date) - same policy shouldn't appear twice in a snapshot
    df = df.drop_duplicates(subset=['policy_id', 'snapshot_date'], keep='first').copy()

    snapshots_list = sorted(df['snapshot_date'].unique())
    # YYYY-MM-DD labels to distinguish multiple snapshots in the same month
    snap_labels = [pd.Timestamp(s).strftime('%Y-%m-%d') for s in snapshots_list]

    # Global monthly
    all_policies_history = set()
    monthly_rows = []
    for i, snap in enumerate(snapshots_list):
        current = set(df[df['snapshot_date'] == snap]['policy_id'])
        prev = set(df[df['snapshot_date'] == snapshots_list[i-1]]['policy_id']) if i > 0 else set()
        retained = prev & current
        new_additions = current - prev
        winback = new_additions & all_policies_history
        truly_new = new_additions - winback
        churned = prev - current
        monthly_rows.append({
            'snap': pd.Timestamp(snap).strftime('%Y-%m-%d'),
            'total': len(current), 'retained': len(retained),
            'new': len(truly_new), 'winback': len(winback), 'churned': len(churned),
            'retRate': round(len(retained)/len(prev)*100, 2) if prev else 0,
            'chRate': round(len(churned)/len(prev)*100, 2) if prev else 0,
        })
        all_policies_history |= current

    # By agency
    agency_hist = {}
    agency_rows = []
    for i, snap in enumerate(snapshots_list):
        snap_df = df[df['snapshot_date'] == snap]
        prev_snap = snapshots_list[i-1] if i > 0 else None
        for agency in sorted(snap_df['agency_short'].unique()):
            agency_current = set(snap_df[snap_df['agency_short'] == agency]['policy_id'])
            if i > 0:
                prev_df = df[df['snapshot_date'] == prev_snap]
                agency_prev = set(prev_df[prev_df['agency_short'] == agency]['policy_id'])
            else:
                agency_prev = set()
            hist_before = agency_hist.get(agency, set())
            retained = agency_prev & agency_current
            new_add = agency_current - agency_prev
            winback = new_add & hist_before
            truly_new = new_add - winback
            churned = agency_prev - agency_current
            agency_rows.append({
                'snap': pd.Timestamp(snap).strftime('%Y-%m-%d'),
                'agency': agency,
                'total': len(agency_current), 'retained': len(retained),
                'new': len(truly_new), 'winback': len(winback), 'churned': len(churned),
                'retRate': round(len(retained)/len(agency_prev)*100, 2) if agency_prev else None,
            })
            agency_hist[agency] = hist_before | agency_current

    # By state
    state_hist = {}
    state_rows = []
    for i, snap in enumerate(snapshots_list):
        snap_df = df[df['snapshot_date'] == snap]
        prev_snap = snapshots_list[i-1] if i > 0 else None
        for state in sorted(snap_df['memberState'].dropna().unique()):
            state_current = set(snap_df[snap_df['memberState'] == state]['policy_id'])
            if i > 0:
                prev_df = df[df['snapshot_date'] == prev_snap]
                state_prev = set(prev_df[prev_df['memberState'] == state]['policy_id'])
            else:
                state_prev = set()
            hist_before = state_hist.get(state, set())
            retained = state_prev & state_current
            new_add = state_current - state_prev
            winback = new_add & hist_before
            truly_new = new_add - winback
            churned = state_prev - state_current
            state_rows.append({
                'snap': pd.Timestamp(snap).strftime('%Y-%m-%d'),
                'state': state,
                'total': len(state_current), 'retained': len(retained),
                'new': len(truly_new), 'winback': len(winback), 'churned': len(churned),
                'retRate': round(len(retained)/len(state_prev)*100, 2) if state_prev else None,
            })
            state_hist[state] = hist_before | state_current

    # Tenure (from latest snapshot)
    latest_df = df[df['snapshot_date'] == snapshots_list[-1]].copy()
    latest_df['tenure_months'] = (pd.Timestamp(snapshots_list[-1]) - latest_df['policyEffectiveDate']).dt.days / 30.4375

    def to_bucket(t):
        if pd.isna(t) or t < 0:
            return 'Unknown'
        for lo, hi, label in [(0,3,'0-3 mo'),(3,6,'3-6 mo'),(6,12,'6-12 mo'),(12,24,'1-2 yr'),(24,36,'2-3 yr'),(36,9999,'3+ yr')]:
            if lo <= t < hi:
                return label
        return 'Unknown'

    latest_df['bucket'] = latest_df['tenure_months'].apply(to_bucket)
    tenure_global = latest_df['bucket'].value_counts().to_dict()
    tenure_by_agency = latest_df.groupby(['agency_short', 'bucket']).size().reset_index(name='count').rename(columns={'agency_short':'agency'})
    tenure_by_state = latest_df.groupby(['memberState', 'bucket']).size().reset_index(name='count').rename(columns={'memberState':'state'})

    return {
        'snapshots': snap_labels,
        'global': monthly_rows,
        'byAgency': agency_rows,
        'byState': state_rows,
        'tenureGlobal': tenure_global,
        'tenureByAgency': tenure_by_agency.to_dict(orient='records'),
        'tenureByState': tenure_by_state.to_dict(orient='records'),
    }


def inject_retention_data_to_jsx(retention_data):
    """Replace the RETENTION_DATA constant in the JSX file with new data."""
    if not DASHBOARD_JSX.exists():
        raise FileNotFoundError(f'Dashboard JSX not found at {DASHBOARD_JSX}')

    with open(DASHBOARD_JSX) as f:
        content = f.read()

    raw_json = json.dumps(retention_data, separators=(',', ':'))

    # Verify ASCII-safe (Babel parser requirement)
    try:
        raw_json.encode('ascii')
    except UnicodeEncodeError as e:
        raise ValueError(f'Retention data contains non-ASCII characters: {e}')

    escaped = raw_json.replace('\\', '\\\\').replace('"', '\\"')
    new_const = f'const RETENTION_DATA=JSON.parse("{escaped}");'

    pattern = r'const RETENTION_DATA=JSON\.parse\("[^"\\]*(?:\\.[^"\\]*)*"\);'
    match = re.search(pattern, content)
    if not match:
        raise RuntimeError('RETENTION_DATA constant not found in dashboard JSX')

    new_content = content[:match.start()] + new_const + content[match.end():]

    with open(DASHBOARD_JSX) as f:
        pass  # already opened above

    with open(DASHBOARD_JSX, 'w') as f:
        f.write(new_content)

    # ALSO regenerate the standalone HTML for GitHub Pages
    regenerate_index_html(new_content)

    return len(new_content)


def regenerate_index_html(jsx_code):
    """Regenerate index.html from the JSX code for GitHub Pages deployment."""
    template_path = Path(__file__).parent / 'html_template.html'
    if not template_path.exists():
        print('  ⚠️  html_template.html not found, skipping HTML regeneration')
        return

    with open(template_path) as f:
        template = f.read()

    # Strip imports and export from JSX (browser context already has React/Recharts/D3 globals)
    jsx_clean = jsx_code.replace(
        'import { useState, useMemo, useEffect, useRef } from "react";\n', ''
    ).replace(
        'import * as d3 from "d3";\n', ''
    ).replace(
        'import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart, Line } from "recharts";\n', ''
    ).replace(
        'export default function Dashboard()', 'function Dashboard()'
    )

    html = template.replace('__JSX_CODE__', jsx_clean)

    # Write to /index.html (root of repo, for GitHub Pages)
    index_path = ROOT / 'index.html'
    with open(index_path, 'w') as f:
        f.write(html)

    print(f'  - index.html regenerated: {len(html):,} chars')


def process_new_bob(filepath, snapshot_date):
    """Main entry point: process a new BOB file end-to-end."""
    print(f'Reading BOB file: {filepath}')
    new_df = read_bob_file(filepath, snapshot_date)
    print(f'  - {len(new_df):,} rows, {new_df["mbiNumber"].nunique():,} unique MBIs')

    # Load master and append
    print('Loading master snapshots...')
    master_df = load_master_snapshots()
    print(f'  - Master: {len(master_df):,} rows, {master_df["snapshot_date"].nunique()} snapshots')

    # Check if snapshot already exists (shouldn't, but safety check)
    existing_snaps = set(pd.Timestamp(s) for s in master_df['snapshot_date'].unique())
    if pd.Timestamp(snapshot_date) in existing_snaps:
        raise ValueError(f'Snapshot {snapshot_date.date()} already exists in master. Cannot duplicate.')

    # Append and save
    combined = pd.concat([master_df, new_df], ignore_index=True)
    print(f'Combined: {len(combined):,} rows, {combined["snapshot_date"].nunique()} snapshots')
    save_master_snapshots(combined)

    # Recalculate retention
    print('Recalculating retention data...')
    retention_data = calculate_retention_data(combined)

    # Save JSON (backup)
    with open(DATA_DIR / 'retention_data.json', 'w') as f:
        json.dump(retention_data, f, separators=(',', ':'))

    # Inject into JSX
    print('Injecting into dashboard JSX...')
    jsx_size = inject_retention_data_to_jsx(retention_data)
    print(f'  - JSX now: {jsx_size:,} chars')

    # Build summary
    snapshots_sorted = sorted(combined['snapshot_date'].unique())
    latest_snap = snapshots_sorted[-1]
    prev_snap = snapshots_sorted[-2] if len(snapshots_sorted) > 1 else None

    latest_df = combined[combined['snapshot_date'] == latest_snap].drop_duplicates(subset=['policy_id'])
    prev_df = combined[combined['snapshot_date'] == prev_snap].drop_duplicates(subset=['policy_id']) if prev_snap is not None else None

    # Aggregate by agency: both policies (rows) and unique members (mbiNumber)
    agency_policies = latest_df.groupby('agency_short').size()
    agency_members = latest_df.groupby('agency_short')['mbiNumber'].nunique()

    if prev_df is not None:
        prev_agency_policies = prev_df.groupby('agency_short').size()
        prev_agency_members = prev_df.groupby('agency_short')['mbiNumber'].nunique()
    else:
        prev_agency_policies = None
        prev_agency_members = None

    # Totals
    total_policies = len(latest_df)
    total_members = latest_df['mbiNumber'].nunique()
    prev_total_policies = len(prev_df) if prev_df is not None else 0
    prev_total_members = prev_df['mbiNumber'].nunique() if prev_df is not None else 0
    delta_policies = total_policies - prev_total_policies
    delta_members = total_members - prev_total_members

    summary_lines = [
        f'Snapshot date:         {pd.Timestamp(latest_snap).strftime("%Y-%m-%d")}',
        f'Previous snapshot:     {pd.Timestamp(prev_snap).strftime("%Y-%m-%d") if prev_snap is not None else "N/A"}',
        '',
        '=== TOTALS ===',
        f'Total Policies (BOB):  {total_policies:>7,}  ({delta_policies:+,} vs previous)',
        f'Total Unique Members:  {total_members:>7,}  ({delta_members:+,} vs previous)',
        f'Total Snapshots:       {combined["snapshot_date"].nunique()}',
        '',
        '=== BY AGENCY ===',
        f'{"Agency":<22} {"Policies":>9} {"Members":>9} {"Pol. Delta":>11} {"Mbr. Delta":>11}',
        '-' * 65,
    ]

    # Sort agencies by policy count descending
    sorted_agencies = agency_policies.sort_values(ascending=False).index
    for agency in sorted_agencies:
        pol = agency_policies[agency]
        mbr = agency_members[agency]
        if prev_agency_policies is not None:
            prev_pol = prev_agency_policies.get(agency, 0)
            prev_mbr = prev_agency_members.get(agency, 0)
            d_pol = pol - prev_pol
            d_mbr = mbr - prev_mbr
            d_pol_str = f'{d_pol:+,}' if d_pol != 0 else '='
            d_mbr_str = f'{d_mbr:+,}' if d_mbr != 0 else '='
        else:
            d_pol_str = 'N/A'
            d_mbr_str = 'N/A'
        summary_lines.append(f'{agency:<22} {pol:>9,} {mbr:>9,} {d_pol_str:>11} {d_mbr_str:>11}')

    # Retention summary (policy-based)
    global_rows = retention_data['global']
    last_rate = global_rows[-1]['retRate'] if len(global_rows) > 0 else 0
    summary_lines.extend([
        '',
        '=== RETENTION (policy-based) ===',
        f'Retention rate vs previous: {last_rate}%',
        f'  Retained:  {global_rows[-1]["retained"]:>6,}',
        f'  New:       {global_rows[-1]["new"]:>6,}',
        f'  Win-backs: {global_rows[-1]["winback"]:>6,}',
        f'  Disenrolled: {global_rows[-1]["churned"]:>6,}',
    ])

    summary = '\n'.join(summary_lines)

    return {
        'summary': summary,
        'snapshot_date': snapshot_date,
        'total_policies': total_policies,
        'total_members': total_members,
        'total_snapshots': combined['snapshot_date'].nunique(),
    }
