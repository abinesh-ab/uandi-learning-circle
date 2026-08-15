# Script to push The X Factors React project to GitHub
# Usage: .\push-to-github.ps1 -Token "YOUR_GITHUB_TOKEN"

param (
    [string]$Token = ""
)

$GIT = "C:\Users\abinesh.l\.gemini\antigravity\scratch\git-portable\cmd\git.exe"
$REPO_URL = "github.com/abinesh-ab/uandi-learning-circle.git"

if ([string]::IsNullOrWhiteSpace($Token)) {
    $Token = Read-Host "Please enter your GitHub Personal Access Token (PAT)"
}

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "Error: Token cannot be empty." -ForegroundColor Red
    exit 1
}

Write-Host "Pushing to https://$REPO_URL ..." -ForegroundColor Cyan
&$GIT push -u "https://${Token}@$REPO_URL" main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to https://github.com/abinesh-ab/uandi-learning-circle !" -ForegroundColor Green
} else {
    Write-Host "Push failed. Ensure your PAT has 'repo' (Classic) or 'Contents: Read & write' (Fine-grained) permissions." -ForegroundColor Red
}
