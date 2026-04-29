"""
ACM BOB Auto-Refresh - Main orchestrator
=========================================
Runs every 10 minutes via GitHub Actions cron.

Workflow:
1. List files in Google Drive /New folder
2. Decide what to do based on count:
   - 0 files: error, alert admins
   - 1 file: normal state, exit
   - 2 files: NEW BOB detected, process it
   - 3+ files: process newest, archive rest, alert admins
3. For valid processing:
   - Compare dates (from filename MM-DD-YY)
   - Validate new file has later date than state.json
   - If OK: move old to /Archive, process new, rebuild dashboard, deploy
   - If fail: leave files in /New, email error
4. Send email notification (success or failure)
"""

import os
import sys
import json
import re
import tempfile
import traceback
from datetime import datetime
from pathlib import Path

# Import helpers
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gdrive_helper import GDriveClient
from email_helper import send_notification
from process_bob import process_new_bob
from deploy_helper import commit_and_push


STATE_FILE = Path(__file__).parent.parent / 'state.json'


def parse_snapshot_date(filename):
    """Extract date from filename like ACM_BOB_04-22-26.xlsx or ACM_BOB_04-22-26-dataChange.xlsx"""
    m = re.search(r'ACM_BOB_(\d{2})-(\d{2})-(\d{2})', filename)
    if not m:
        return None
    mm, dd, yy = m.groups()
    return datetime(2000 + int(yy), int(mm), int(dd))


def load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    return {'last_processed_date': None, 'last_processed_file': None, 'last_run': None}


def save_state(state):
    state['last_run'] = datetime.utcnow().isoformat()
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)


def main():
    print(f"=== ACM BOB Auto-Refresh - {datetime.utcnow().isoformat()} ===")
    state = load_state()
    print(f"State: {state}")

    # Initialize Google Drive client
    try:
        gdrive = GDriveClient()
    except Exception as e:
        print(f"ERROR: Cannot connect to Google Drive: {e}")
        send_notification(
            success=False,
            subject="ACM BOB Refresh - GDrive Connection Error",
            body=f"Could not connect to Google Drive API.\n\nError: {e}"
        )
        sys.exit(1)

    # List files in /New
    try:
        new_files = gdrive.list_files_in_folder(folder_name='New')
        print(f"Files in /New: {len(new_files)}")
        for f in new_files:
            print(f"  - {f['name']} (modified: {f['modifiedTime']})")
    except Exception as e:
        print(f"ERROR listing /New: {e}")
        send_notification(
            success=False,
            subject="ACM BOB Refresh - Cannot List /New",
            body=f"Error listing files in /New folder: {e}"
        )
        sys.exit(1)

    # Decision tree
    num_files = len(new_files)

    if num_files == 0:
        # ERROR: Should always have at least 1 file
        print("ERROR: /New folder is empty")
        send_notification(
            success=False,
            subject="ACM BOB Refresh - ALERT: /New folder empty",
            body="The /New folder is empty. This should not happen.\n\n"
                 "Expected: Always at least 1 file (the current BOB in use).\n\n"
                 "Please upload the current BOB back to /New manually."
        )
        sys.exit(1)

    if num_files == 1:
        # Normal state, nothing to do
        print(f"Normal state: 1 file in /New ({new_files[0]['name']}). No action needed.")
        save_state(state)
        sys.exit(0)

    # num_files >= 2: New BOB detected
    print(f"NEW BOB detected ({num_files} files in /New)")

    # Extract dates and validate all filenames
    files_with_dates = []
    invalid_files = []
    for f in new_files:
        dt = parse_snapshot_date(f['name'])
        if dt is None:
            invalid_files.append(f['name'])
        else:
            files_with_dates.append({'file': f, 'date': dt})

    if invalid_files:
        print(f"ERROR: Invalid filenames: {invalid_files}")
        send_notification(
            success=False,
            subject="ACM BOB Refresh - Invalid Filename",
            body=f"Files with invalid names found in /New:\n\n" +
                 "\n".join(f"  - {n}" for n in invalid_files) +
                 "\n\nExpected format: ACM_BOB_MM-DD-YY.xlsx (with optional -suffix)\n\n"
                 "Files were NOT moved. Please fix filenames manually."
        )
        sys.exit(1)

    # Sort by date (newest first)
    files_with_dates.sort(key=lambda x: x['date'], reverse=True)
    newest = files_with_dates[0]
    older_files = files_with_dates[1:]

    print(f"Newest: {newest['file']['name']} ({newest['date'].strftime('%Y-%m-%d')})")
    print(f"Older to archive: {[f['file']['name'] for f in older_files]}")

    # Validate new date is posterior to last processed
    last_processed = state.get('last_processed_date')
    if last_processed:
        last_dt = datetime.fromisoformat(last_processed)
        if newest['date'] <= last_dt:
            print(f"ERROR: Newest file date ({newest['date'].date()}) is not after last processed ({last_dt.date()})")
            send_notification(
                success=False,
                subject="ACM BOB Refresh - ALERT: Date Not Posterior",
                body=f"The uploaded file has a date that is NOT posterior to the last processed file.\n\n"
                     f"Uploaded: {newest['file']['name']} ({newest['date'].date()})\n"
                     f"Last processed: {state.get('last_processed_file')} ({last_dt.date()})\n\n"
                     f"No action taken. Files remain in /New.\n\n"
                     f"Please verify and remove the incorrect file manually."
            )
            sys.exit(1)

    # Alert if 3+ files (edge case)
    alert_multiple = num_files >= 3

    # Download newest file to temp location
    try:
        tmpdir = tempfile.mkdtemp(prefix='acm_bob_')
        new_local_path = os.path.join(tmpdir, newest['file']['name'])
        print(f"Downloading {newest['file']['name']} to {new_local_path}...")
        gdrive.download_file(newest['file']['id'], new_local_path)
        print(f"Downloaded: {os.path.getsize(new_local_path):,} bytes")
    except Exception as e:
        print(f"ERROR downloading: {e}")
        send_notification(
            success=False,
            subject="ACM BOB Refresh - Download Failed",
            body=f"Failed to download the new BOB file.\n\nError: {e}\n\nFiles remain in /New."
        )
        sys.exit(1)

    # Process the BOB (this is the heavy lifting)
    try:
        print("Processing BOB...")
        result = process_new_bob(new_local_path, newest['date'])
        print(f"Processing complete: {result['summary']}")
    except Exception as e:
        print(f"ERROR processing BOB: {e}")
        traceback.print_exc()
        send_notification(
            success=False,
            subject="ACM BOB Refresh - Processing Failed",
            body=f"Failed to process new BOB file {newest['file']['name']}.\n\n"
                 f"Error: {e}\n\n"
                 f"Traceback:\n{traceback.format_exc()}\n\n"
                 f"Files remain in /New. Please investigate."
        )
        sys.exit(1)

    # Commit and push to trigger Netlify deploy
    try:
        print("Committing and pushing to GitHub...")
        commit_msg = f"Auto-update: {newest['file']['name']} ({newest['date'].strftime('%Y-%m-%d')})"
        commit_and_push(commit_msg)
        print("Pushed to GitHub")
    except Exception as e:
        print(f"ERROR pushing to GitHub: {e}")
        send_notification(
            success=False,
            subject="ACM BOB Refresh - Git Push Failed",
            body=f"Processed BOB successfully but failed to push to GitHub.\n\nError: {e}\n\n"
                 f"Dashboard NOT updated. Files remain in /New."
        )
        sys.exit(1)

    # Move old files to /Archive (only after successful processing & push)
    try:
        print("Moving old files to /Archive...")
        for older in older_files:
            gdrive.move_file_to_folder(older['file']['id'], 'Archive')
            print(f"  Moved to Archive: {older['file']['name']}")
    except Exception as e:
        print(f"WARNING: Could not move old files to archive: {e}")
        # Not critical - dashboard is already updated, just need manual cleanup
        send_notification(
            success=True,
            subject="ACM BOB Refresh - Success (partial) - Manual Archive Needed",
            body=f"Dashboard was updated successfully with {newest['file']['name']}.\n\n"
                 f"However, failed to move old files to /Archive.\n\n"
                 f"Error: {e}\n\n"
                 f"Please move these files manually:\n" +
                 "\n".join(f"  - {f['file']['name']}" for f in older_files)
        )
        # Continue - don't exit with error

    # Update state
    state['last_processed_date'] = newest['date'].isoformat()
    state['last_processed_file'] = newest['file']['name']
    save_state(state)
    # Commit state.json update too
    try:
        commit_and_push(f"Update state.json after processing {newest['file']['name']}")
    except Exception as e:
        print(f"WARNING: state.json push failed: {e}")

    # Send success email
    body = (
        f"Dashboard updated successfully.\n\n"
        f"File processed: {newest['file']['name']}\n"
        f"Snapshot date: {newest['date'].strftime('%Y-%m-%d')}\n\n"
        f"--- Summary ---\n{result['summary']}\n\n"
        f"Dashboard URL: {os.environ.get('DASHBOARD_URL', 'https://acm-dashboard.netlify.app')}\n"
        f"(Netlify deploy takes 2-3 minutes to go live)\n"
    )
    if alert_multiple:
        body = (
            f"NOTICE: {num_files} files were found in /New. Processed the newest, archived the rest.\n\n" + body
        )

    send_notification(
        success=True,
        subject=f"ACM BOB Refresh - Success - {newest['date'].strftime('%Y-%m-%d')}",
        body=body
    )
    print("Done.")


if __name__ == '__main__':
    main()
