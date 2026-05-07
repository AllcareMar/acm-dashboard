"""
Initial bootstrap: process all historical BOB files and create the master snapshots pickle.

Run this ONCE at the very beginning, after uploading all historical BOB files to a local
folder. This creates data/snapshots_master.pkl which is then used by the automated workflow.

Usage:
    python setup_initial_data.py /path/to/folder/with/bob/files

The folder should contain ALL historical BOB files. Their filenames must follow the
format: ACM_BOB_MM-DD-YY*.xlsx
"""

import sys
import os
import re
import glob
from datetime import datetime
from pathlib import Path
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from process_bob import read_bob_file, DATA_DIR, save_master_snapshots


def parse_snapshot_date(filename):
    m = re.search(r'ACM_BOB_(\d{2})-(\d{2})-(\d{2})', filename)
    if not m:
        return None
    mm, dd, yy = m.groups()
    return datetime(2000 + int(yy), int(mm), int(dd))


def main(folder):
    files = sorted(glob.glob(os.path.join(folder, 'ACM_BOB_*.xlsx')))
    if not files:
        print(f'No ACM_BOB_*.xlsx files found in {folder}')
        sys.exit(1)

    print(f'Found {len(files)} BOB files to process')

    all_snapshots = []
    errors = []
    for f in files:
        fname = os.path.basename(f)
        snapshot_date = parse_snapshot_date(fname)
        if not snapshot_date:
            print(f'  SKIP: {fname} (invalid filename)')
            errors.append(fname)
            continue
        try:
            df = read_bob_file(f, snapshot_date)
            all_snapshots.append(df)
            print(f'  OK: {fname} - {len(df):,} rows, date={snapshot_date.strftime("%Y-%m-%d")}')
        except Exception as e:
            print(f'  ERROR: {fname} - {e}')
            errors.append(fname)

    if not all_snapshots:
        print('No valid files to process')
        sys.exit(1)

    combined = pd.concat(all_snapshots, ignore_index=True)

    # Dedupe same-month files (keep the one with the most recent day - e.g. 12-31-25 over 12-30-25)
    combined = combined.sort_values('snapshot_date')
    combined['ym'] = combined['snapshot_date'].dt.to_period('M')

    # For each (mbi, year-month), keep the row with the latest snapshot_date
    # But we want snapshots, not all MBIs -- we want to keep only latest snapshot per month
    latest_per_month = combined.groupby('ym')['snapshot_date'].max().reset_index()
    latest_dates = set(latest_per_month['snapshot_date'].unique())
    filtered = combined[combined['snapshot_date'].isin(latest_dates)].drop(columns=['ym']).copy()

    dropped = combined['snapshot_date'].nunique() - filtered['snapshot_date'].nunique()
    if dropped > 0:
        print(f'\nDeduplicated same-month snapshots: dropped {dropped} older snapshot(s)')

    # Final dedup at (mbi, snapshot) level
    filtered = filtered.drop_duplicates(subset=['mbiNumber', 'snapshot_date'], keep='first').copy()

    print(f'\nFinal: {len(filtered):,} rows, {filtered["snapshot_date"].nunique()} snapshots, {filtered["mbiNumber"].nunique():,} unique MBIs')

    DATA_DIR.mkdir(exist_ok=True)
    save_master_snapshots(filtered)
    print(f'Saved to {DATA_DIR / "snapshots_master.pkl"}')

    if errors:
        print(f'\n{len(errors)} files had errors:')
        for e in errors:
            print(f'  - {e}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python setup_initial_data.py /path/to/folder/with/bob/files')
        sys.exit(1)
    main(sys.argv[1])
