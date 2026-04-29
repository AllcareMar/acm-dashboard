# First-Time Setup Guide

Estimated time: **45-60 minutes** total, most of it is waiting for services to confirm.

You'll need to set up 5 things:
1. GitHub repository
2. Google Drive folders + service account
3. Netlify site
4. Gmail app password
5. Bootstrap + first deploy

Let's go.

---

## Step 1: Create the GitHub Repository (10 min)

### 1.1 Create the repo

1. Go to https://github.com/new
2. Repository name: `acm-dashboard` (or whatever you prefer)
3. Visibility: **Private** (the dashboard has agency data)
4. DO NOT initialize with README (you'll push one yourself)
5. Click **Create repository**

### 1.2 Upload the initial files

On your PC, create a folder and copy these files into it:

```
acm-dashboard/
├── imo-uhc-dashboard.jsx         # (current dashboard)
├── state.json                    # (from the automation bundle)
├── requirements.txt              # (from the automation bundle)
├── README.md                     # (from the automation bundle)
├── .gitignore                    # (from the automation bundle)
├── .github/workflows/check-new-bob.yml
├── scripts/                      # (all the .py files from the automation bundle)
├── data/                         # (empty for now - we'll fill with master pickle)
└── docs/                         # (from the automation bundle)
```

### 1.3 Push to GitHub

Open a terminal:

```bash
cd acm-dashboard
git init
git add .
git commit -m "Initial dashboard + automation setup"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/acm-dashboard.git
git push -u origin main
```

---

## Step 2: Google Drive Setup (15 min)

### 2.1 Create the folders

1. Go to https://drive.google.com
2. Create a folder: **`ACM BOB Reports`**
3. Inside it, create two subfolders:
   - **`New`**
   - **`Archive`**
4. Move **`ACM_BOB_04-14-26-dataChangeAgency.xlsx`** (the current BOB) into `/New`
5. Move **all other historical BOB files** (the other 25) into `/Archive`

### 2.2 Create a Google Cloud service account

This gives GitHub Actions permission to read/write the folders.

1. Go to https://console.cloud.google.com/
2. Create a new project: **`acm-dashboard-automation`**
3. Wait for it to provision (~30 seconds)
4. Make sure the project is selected (top-left dropdown)

### 2.3 Enable the Drive API

1. In the left menu: **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 2.4 Create the service account

1. **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **Service account**
3. Name: `acm-bob-automation`
4. Description: `GitHub Actions service account for BOB refresh`
5. Click **Create and Continue**
6. Role: **Editor** (or leave blank, we'll share folders directly)
7. Click **Done**

### 2.5 Generate JSON key

1. Click on the service account you just created
2. Go to **Keys** tab
3. **Add Key** → **Create new key** → **JSON**
4. A `.json` file downloads. **KEEP THIS SAFE** - don't commit to git!

### 2.6 Share Drive folders with the service account

1. Open the downloaded JSON file in a text editor
2. Find the `"client_email"` field - copy that email (looks like `acm-bob-automation@acm-dashboard-automation.iam.gserviceaccount.com`)
3. Back in Google Drive:
   - Right-click `ACM BOB Reports` folder → **Share**
   - Paste the service account email
   - Give it **Editor** access
   - UNCHECK "Notify people" (service accounts don't need emails)
   - Click **Share**
4. The folder is now accessible to GitHub Actions

### 2.7 Get the folder IDs

You need the URL-based IDs of the `/New` and `/Archive` folders:

1. Open the `/New` folder in Drive
2. Look at the URL: `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz`
3. The ID is the part after `/folders/` - copy it
4. Repeat for `/Archive`
5. Save both IDs - you'll need them in Step 5

---

## Step 3: Netlify Setup (5 min)

1. Go to https://app.netlify.com
2. If you have a site for the dashboard already: **skip to 3.5**
3. **Add new site** → **Import an existing project** → **GitHub**
4. Authorize Netlify if prompted
5. Select the `acm-dashboard` repo
6. Build settings:
   - Build command: (leave empty - the JSX is a raw artifact)
   - Publish directory: `.`
7. Deploy site

### 3.5 If dashboard needs a build step

If your artifact is a React component that needs building, you'll need a build config.
For now, the JSX is embedded and the easiest is to serve it via Netlify's artifact renderer.
**This is custom per setup** - check your current Netlify config.

---

## Step 4: Gmail App Password (5 min)

The automation needs to send emails from your wmartinez@allcaremar.com account.

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. After 2FA is on, go to https://myaccount.google.com/apppasswords
4. Name the app: **ACM BOB Automation**
5. Copy the 16-character password (looks like `abcd efgh ijkl mnop`)
6. **Save it somewhere safe** - you won't see it again
7. Remove the spaces when using it (so it becomes `abcdefghijklmnop`)

---

## Step 5: Configure GitHub Secrets (10 min)

This is where you plug in all the credentials from the previous steps.

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each of these:

| Secret Name | Value |
|---|---|
| `GDRIVE_CREDENTIALS_JSON` | Paste the **entire contents** of the JSON file from Step 2.5 |
| `GDRIVE_NEW_FOLDER_ID` | The ID from Step 2.7 (the `/New` folder) |
| `GDRIVE_ARCHIVE_FOLDER_ID` | The ID from Step 2.7 (the `/Archive` folder) |
| `GMAIL_SENDER` | `wmartinez@allcaremar.com` |
| `GMAIL_APP_PASSWORD` | The 16-char password from Step 4 (no spaces) |
| `EMAIL_RECIPIENTS` | `wmartinez@allcaremar.com,jcabreja@allcaremar.com` |
| `DASHBOARD_URL` | Your Netlify URL, e.g. `https://acm-dashboard.netlify.app` |

---

## Step 6: Bootstrap Historical Data (5 min)

The automation needs the historical master pickle file with all 25 snapshots.

### Option A (recommended): Use the pre-built pickle

The automation bundle includes `data/snapshots_master.pkl` which already has all 25
historical snapshots. Just make sure it's in the `data/` folder and commit it:

```bash
git add data/snapshots_master.pkl
git commit -m "Add master snapshots (25 historical BOBs)"
git push
```

### Option B: Regenerate from scratch

If you need to regenerate (e.g. the pickle got corrupted):

1. Put all 26 historical BOB files in a local folder, e.g. `~/bob_archive`
2. Run:
   ```bash
   cd acm-dashboard
   pip install -r requirements.txt
   python scripts/setup_initial_data.py ~/bob_archive
   ```
3. This creates `data/snapshots_master.pkl`
4. Commit and push:
   ```bash
   git add data/snapshots_master.pkl
   git commit -m "Rebuild master snapshots"
   git push
   ```

---

## Step 7: Test the System (5 min)

### 7.1 Manual trigger test

Before waiting for a real weekly upload:

1. Go to GitHub → **Actions** tab
2. Click **ACM BOB Auto-Refresh** on the left
3. Click **Run workflow** (top right) → **Run workflow**
4. Wait 1-2 minutes
5. Click on the running job → see live logs
6. Expected output: **"Normal state: 1 file in /New ... No action needed."**
7. No email should be sent (nothing happened)

### 7.2 Real test with a new file

When next week's BOB arrives:

1. Drop the new file into Google Drive `/New`
2. Wait up to 15 minutes (or trigger manually from Actions tab)
3. Check email for confirmation
4. Verify dashboard shows new data

---

## Congrats!

You're now set up. Every week:

1. Download latest BOB from UHC
2. Drag to Google Drive `/New`
3. Wait for email
4. Done

See `docs/TROUBLESHOOTING.md` if something doesn't work.
