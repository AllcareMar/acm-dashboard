"""
Google Drive client helper for ACM BOB automation.
Uses service account credentials stored in GDRIVE_CREDENTIALS_JSON env var.
"""

import os
import json
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload


SCOPES = ['https://www.googleapis.com/auth/drive']


class GDriveClient:
    def __init__(self):
        creds_json = os.environ.get('GDRIVE_CREDENTIALS_JSON')
        if not creds_json:
            raise RuntimeError('GDRIVE_CREDENTIALS_JSON env var not set')

        creds_dict = json.loads(creds_json)
        credentials = service_account.Credentials.from_service_account_info(
            creds_dict, scopes=SCOPES
        )
        self.service = build('drive', 'v3', credentials=credentials)

        # Folder IDs are passed as env vars
        self.folder_ids = {
            'New': os.environ.get('GDRIVE_NEW_FOLDER_ID'),
            'Archive': os.environ.get('GDRIVE_ARCHIVE_FOLDER_ID'),
        }
        if not self.folder_ids['New'] or not self.folder_ids['Archive']:
            raise RuntimeError('GDRIVE_NEW_FOLDER_ID and GDRIVE_ARCHIVE_FOLDER_ID must be set')

    def list_files_in_folder(self, folder_name='New'):
        """List all files in the specified folder (not subfolders)."""
        folder_id = self.folder_ids[folder_name]
        query = f"'{folder_id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'"
        results = self.service.files().list(
            q=query,
            fields='files(id, name, modifiedTime, size)',
            pageSize=100,
        ).execute()
        return results.get('files', [])

    def download_file(self, file_id, local_path):
        """Download a Drive file to a local path."""
        request = self.service.files().get_media(fileId=file_id)
        with io.FileIO(local_path, 'wb') as fh:
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
        return local_path

    def move_file_to_folder(self, file_id, dest_folder_name='Archive'):
        """Move a file from its current folder to the destination folder."""
        dest_folder_id = self.folder_ids[dest_folder_name]
        # Get current parents
        file = self.service.files().get(fileId=file_id, fields='parents').execute()
        previous_parents = ','.join(file.get('parents', []))
        # Move
        self.service.files().update(
            fileId=file_id,
            addParents=dest_folder_id,
            removeParents=previous_parents,
            fields='id, parents',
        ).execute()
