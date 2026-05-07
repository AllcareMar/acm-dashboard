"""
Gmail SMTP email notifications for ACM BOB automation.
Uses an app password stored in GMAIL_APP_PASSWORD env var.
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime


SENDER_EMAIL = os.environ.get('GMAIL_SENDER', 'wmartinez@allcaremar.com')
# Comma-separated list of recipients
RECIPIENTS = os.environ.get('EMAIL_RECIPIENTS', 'wmartinez@allcaremar.com,jcabreja@allcaremar.com').split(',')


def send_notification(success, subject, body):
    """Send an email via Gmail SMTP.

    Args:
        success: bool - whether this is a success or failure notification
        subject: str - email subject
        body: str - plain text email body
    """
    app_password = os.environ.get('GMAIL_APP_PASSWORD')
    if not app_password:
        print('WARNING: GMAIL_APP_PASSWORD not set, skipping email')
        print(f'Would have sent: {subject}')
        print(body)
        return

    recipients = [r.strip() for r in RECIPIENTS if r.strip()]

    # Build HTML version for nicer formatting
    status_color = '#10b981' if success else '#ef4444'
    status_icon = '✅' if success else '❌'
    html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="background-color: #002677; color: #ffffff; padding: 24px 32px;">
      <h1 style="margin: 0; font-size: 20px;">ACM Dashboard - Auto Refresh</h1>
      <p style="margin: 4px 0 0 0; font-size: 14px; color: #c7d2fe;">{datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}</p>
    </div>
    <div style="padding: 24px 32px;">
      <div style="display: inline-block; padding: 6px 14px; background-color: {status_color}; color: #ffffff; border-radius: 6px; font-weight: 700; font-size: 13px; margin-bottom: 16px;">
        {status_icon} {'SUCCESS' if success else 'FAILED'}
      </div>
      <h2 style="color: #002677; font-size: 16px; margin: 0 0 12px 0;">{subject}</h2>
      <pre style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-wrap: break-word; font-family: 'Courier New', monospace;">{body}</pre>
    </div>
    <div style="background-color: #f9fafb; padding: 12px 32px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #64748b; text-align: center;">
      Automated message from ACM BOB Refresh System | AllCare Mar Agency LLC
    </div>
  </div>
</body>
</html>"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"[{'OK' if success else 'FAIL'}] {subject}"
    msg['From'] = SENDER_EMAIL
    msg['To'] = ', '.join(recipients)

    msg.attach(MIMEText(body, 'plain'))
    msg.attach(MIMEText(html_body, 'html'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(SENDER_EMAIL, app_password)
        server.sendmail(SENDER_EMAIL, recipients, msg.as_string())

    print(f'Email sent to {recipients}')
