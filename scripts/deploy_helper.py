"""
Git commit & push helper. In GitHub Actions context, git is pre-configured.
Pushing to main triggers Netlify auto-deploy.
"""

import subprocess
import os


def run_git(args, check=True):
    """Run a git command and return output."""
    result = subprocess.run(
        ['git'] + args,
        capture_output=True,
        text=True,
        check=False,
        cwd=os.environ.get('GITHUB_WORKSPACE', '.'),
    )
    if check and result.returncode != 0:
        raise RuntimeError(f'git {" ".join(args)} failed:\nstdout: {result.stdout}\nstderr: {result.stderr}')
    return result.stdout


def commit_and_push(message):
    """Stage all changes, commit, and push to current branch."""
    # Configure git identity (needed in GitHub Actions)
    run_git(['config', 'user.email', 'actions@github.com'], check=False)
    run_git(['config', 'user.name', 'ACM Auto-Refresh'], check=False)

    # Stage changes
    run_git(['add', '-A'])

    # Check if there are changes to commit
    status = run_git(['status', '--porcelain'])
    if not status.strip():
        print('No changes to commit')
        return False

    # Commit
    run_git(['commit', '-m', message])

    # Push (GitHub Actions provides GITHUB_TOKEN auth automatically)
    run_git(['push'])
    return True
