# Quick Start - 5 Steps to Production

For someone setting up the ACM Dashboard automation. Read SETUP.md for details.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   STEP 1: Create GitHub Repo (private)                          │
│   github.com/new → "acm-dashboard" → push this folder           │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   STEP 2: Setup Google Drive                                    │
│   • Create folders /New and /Archive                            │
│   • Move current BOB to /New, others to /Archive                │
│   • Create service account in Google Cloud                      │
│   • Share folders with service account                          │
│   • Save the JSON key file (DO NOT COMMIT)                      │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   STEP 3: Connect Netlify                                       │
│   • app.netlify.com → "Import from GitHub"                      │
│   • Select acm-dashboard repo                                   │
│   • Auto-detects Vite, builds on push                           │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   STEP 4: Get Gmail App Password                                │
│   • myaccount.google.com → Security → App passwords             │
│   • Save 16-char password                                       │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   STEP 5: Add Secrets to GitHub                                 │
│   Repo → Settings → Secrets and variables → Actions             │
│                                                                 │
│   Required secrets:                                             │
│     • GDRIVE_CREDENTIALS_JSON   (entire JSON file content)      │
│     • GDRIVE_NEW_FOLDER_ID                                      │
│     • GDRIVE_ARCHIVE_FOLDER_ID                                  │
│     • GMAIL_SENDER                                              │
│     • GMAIL_APP_PASSWORD                                        │
│     • EMAIL_RECIPIENTS          (comma-separated)               │
│     • DASHBOARD_URL                                             │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ✅ DONE - Test by uploading a new BOB to /New folder          │
│                                                                 │
│   • Wait 10-15 min                                              │
│   • Email arrives                                               │
│   • Dashboard updates                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Weekly Operation (after setup)

```
┌──────────────────────────────────────────────┐
│  Tuesday: Download BOB from UHC portal       │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Drag file into Google Drive /New folder     │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Wait 10-15 min                              │
└──────────────────┬───────────────────────────┘
                   ↓
┌──────────────────────────────────────────────┐
│  Email arrives:                              │
│    ✅ SUCCESS = Dashboard updated            │
│    ❌ FAILED  = See email for what to fix    │
└──────────────────────────────────────────────┘
```

---

## What's automated vs manual

**Automated (you do nothing):**
- Detection of new file
- Date validation
- Old file → Archive
- BOB processing
- Retention recalculation
- Dashboard rebuild
- Git commit & push
- Netlify deploy
- Email notification

**Manual (you do these):**
- Download BOB from UHC weekly
- Drag-drop to /New folder
- Read confirmation email
- (Optional) Fix issues if email reports a failure
