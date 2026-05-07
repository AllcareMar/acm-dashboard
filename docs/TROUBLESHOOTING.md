# Troubleshooting Guide

## Email received: "FAIL - Invalid Filename"

**Symptom:** You uploaded a file to `/New` but it doesn't follow the naming convention.

**Fix:** Rename the file to match `ACM_BOB_MM-DD-YY.xlsx` (e.g. `ACM_BOB_04-22-26.xlsx`).
Suffixes after the date are allowed: `ACM_BOB_04-22-26-dataChange.xlsx` works fine.

---

## Email received: "FAIL - Date Not Posterior"

**Symptom:** You uploaded a file with a date that's older than the currently processed one.

**Fix:**
1. Go to Google Drive `/New`
2. Delete the file you just uploaded (it's the wrong one)
3. Only the correct current BOB should remain
4. No further action needed - system will skip next check

---

## Email received: "FAIL - Processing Failed"

**Symptom:** Dashboard refresh failed during BOB processing.

**Common causes & fixes:**

### Missing required columns
The file is missing `mbiNumber` or `policyEffectiveDate` columns.
- Open the BOB file in Excel
- Verify it has the standard BOB format
- Re-download from UHC portal if corrupted
- Delete the bad file from `/New` and re-upload the correct one

### Header row not detected
The script couldn't find where the data headers start.
- UHC sometimes changes the format slightly
- Check the first 10 rows of the file in Excel
- If the format genuinely changed, contact the developer (this requires a code update)

---

## Email received: "FAIL - Git Push Failed"

**Symptom:** BOB was processed OK but couldn't push to GitHub.

**Fix:**
1. Go to GitHub → Actions → click the failing run
2. Check if there's a merge conflict with a manual commit
3. Most common fix: go to Actions → **Re-run failed jobs**

If it keeps failing, someone may have made manual commits to main that conflict.
Contact the developer.

---

## No emails at all after uploading

**Symptom:** Uploaded file 30+ min ago, no email received.

**Checklist:**

1. **Is the cron running?**
   - Go to GitHub → Actions tab
   - Look for recent runs of "ACM BOB Auto-Refresh"
   - If no runs in last hour: GitHub may have disabled the cron (happens if repo has no activity for 60 days)
   - **Fix:** Go to Actions tab → enable workflows manually

2. **Did the run succeed silently?**
   - Click the most recent run
   - Look for "Normal state: 1 file in /New. No action needed."
   - If you see that, it means the system didn't detect your new file
   - Possible causes:
     - File not actually in `/New` (check Google Drive folder)
     - File modification time was BEFORE the previous run (rare)

3. **Is the service account still active?**
   - Go to Google Cloud Console → IAM
   - Verify service account not disabled
   - Check if the JSON key has expired (they don't expire by default but can be revoked)

4. **Gmail SMTP issues?**
   - Go to https://myaccount.google.com/security
   - Check for any security alerts blocking the app password
   - App passwords can be revoked if Google detects "suspicious activity"
   - **Fix:** Generate a new app password, update `GMAIL_APP_PASSWORD` secret

---

## Dashboard didn't update even though email said SUCCESS

**Symptom:** Email confirms success, but the Netlify site still shows old data.

**Fix:**

1. **Wait 2-3 minutes.** Netlify builds take a bit.

2. **Check Netlify deploy:**
   - Go to https://app.netlify.com/sites/YOUR_SITE/deploys
   - Most recent deploy should be within last 5 min, status = Published
   - If status = Failed, click to see the error

3. **Hard refresh the browser:**
   - Windows: Ctrl+F5
   - Mac: Cmd+Shift+R
   - This clears cached old version

4. **Verify commit made it to GitHub:**
   - Go to repo → Commits
   - Should see "Auto-update: ACM_BOB_XX-XX-XX.xlsx" within last few minutes

---

## "GDrive Connection Error"

**Symptom:** Email says GitHub Actions can't connect to Google Drive.

**Fix:**

1. **Credentials JSON is malformed:**
   - Go to GitHub → Settings → Secrets
   - Edit `GDRIVE_CREDENTIALS_JSON`
   - Make sure the ENTIRE JSON file content is pasted (starts with `{` ends with `}`)
   - Common error: pasted only the content inside quotes

2. **Service account was deleted/disabled:**
   - Go to Google Cloud Console → IAM & Admin → Service Accounts
   - If deleted: recreate following Step 2 of SETUP.md
   - Update `GDRIVE_CREDENTIALS_JSON` secret with new key

3. **Folder no longer shared:**
   - Re-share the `/New` and `/Archive` folders with the service account email

---

## The workflow runs but never detects the file

**Symptom:** Logs show "Files in /New: 1" even though you uploaded a second file.

**Checklist:**

1. **File uploaded to correct folder?**
   - Some people accidentally upload to a parent folder
   - Verify URL path matches the `GDRIVE_NEW_FOLDER_ID` secret

2. **File shared correctly?**
   - If you uploaded through a different account, it may not be visible to the service account
   - Re-upload while logged in as the admin account

3. **Google Drive sync delay:**
   - Rarely, Drive can take a few minutes to propagate through its API
   - Wait 5-10 min, try again

---

## Force a manual refresh

When you want to force-process regardless of the cron schedule:

1. Go to GitHub → Actions
2. Click **ACM BOB Auto-Refresh** on the left
3. Click **Run workflow** (green button top right)
4. Select branch: `main`
5. Click **Run workflow**
6. Wait 1-2 min, watch live logs

---

## Rollback to a previous dashboard version

If the new BOB broke something visual on the dashboard:

### Option 1: Netlify rollback (fastest)
1. Go to https://app.netlify.com/sites/YOUR_SITE/deploys
2. Find an older working deploy
3. Click **Publish deploy** on that one
4. Site reverts immediately

### Option 2: Git revert (permanent)
```bash
git log --oneline  # find the bad commit
git revert <bad-commit-hash>
git push
```
This pushes a new commit that undoes the bad one. Netlify redeploys automatically.

---

## I accidentally deleted state.json

**Symptom:** Fresh errors about no last processed date.

**Fix:**

Re-create `state.json` in the repo root with:

```json
{
  "last_processed_date": "2026-04-14T00:00:00",
  "last_processed_file": "ACM_BOB_04-14-26-dataChangeAgency.xlsx",
  "last_run": null
}
```

Update the date and filename to match the most recent BOB that's been processed.
Commit and push.

---

## I need to reprocess an old file

**Scenario:** The February 2026 BOB had an issue and was processed with wrong data. You want to reprocess it.

**Fix:**

This is **not automatic** - it requires manual intervention because the system is designed
to only go forward in time. To reprocess:

1. Regenerate the master pickle from scratch:
   ```bash
   python scripts/setup_initial_data.py ~/all_bob_files_folder
   ```
2. Commit the new pickle:
   ```bash
   git add data/snapshots_master.pkl
   git commit -m "Rebuild historical data"
   git push
   ```
3. Dashboard redeploys with corrected history

---

## Still stuck?

1. Check GitHub Actions logs for the failing run - they usually tell you exactly what went wrong
2. If a Python error: the traceback is in the email body
3. Contact whoever built this system with:
   - The email you received
   - A screenshot of the Actions log
   - What you were trying to do
