#!/bin/bash

# ================================================================================
# GitHub Webhook Setup Script
# ================================================================================
# This script adds webhooks to all your GitHub repositories automatically.
# 
# Usage:
#   1. Edit the variables below (GITHUB_USER, WEBHOOK_URL, WEBHOOK_SECRET)
#   2. Edit the REPOS array with your repository names
#   3. Run: chmod +x setup_hooks.sh && ./setup_hooks.sh
# ================================================================================

# ================================= CONFIGURATION #############################

# Your GitHub username
GITHUB_USER="kareem2099"

# Your webhook URL (update after deploying to Vercel/production)
WEBHOOK_URL="https://696d-41-35-237-237.ngrok-free.app/api/webhooks/github"

# Your webhook secret (reads from .env file automatically)
if [ -f "../.env.local" ]; then
  export $(grep -v '^#' ../.env.local | xargs)
  WEBHOOK_SECRET="${GITHUB_WEBHOOK_SECRET}"
else
  echo "❌ Error: .env.local file not found!"
  exit 1
fi

# List of your repositories (space-separated)
REPOS=(
  "DotScramble"
  "DotCommand"
  "DotSense"
  "DotFetch"
  "DotEnvy"
  "DotShare"
  "codetune"
  "DotReadme"
  "dotctl"
)

# ======================================= SCRIPT #############################

echo "🚀 Starting Webhook Setup..."
echo "   GitHub User: $GITHUB_USER"
echo "   Webhook URL: $WEBHOOK_URL"
echo "   Repositories: ${#REPOS[@]}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "   Install with: sudo apt install gh"
    echo "   Then run: gh auth login"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub."
    echo "   Run: gh auth login"
    exit 1
fi

# Loop through all repositories
for REPO in "${REPOS[@]}"; do
    echo "🔗 Adding webhook to $GITHUB_USER/$REPO..."
    
    # Add webhook using GitHub API
    gh api repos/$GITHUB_USER/$REPO/hooks \
        -X POST \
        -f name="web" \
        -f config[url]="$WEBHOOK_URL" \
        -f config[content_type]="json" \
        -f config[secret]="$WEBHOOK_SECRET" \
        -f events[]="push" \
        -f events[]="release" \
        --silent \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Done for $REPO"
    else
        echo "   ❌ Failed for $REPO"
    fi
done

echo ""
echo "🎉 All webhooks setup completed!"
echo ""
echo "Note: Make sure your webhook URL is accessible from GitHub."
echo "      If testing locally, use ngrok to expose localhost."
