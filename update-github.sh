#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Updating GitHub Repository with React Frontend${NC}"
echo -e "${YELLOW}=================================================${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    echo -e "${YELLOW}Run 'git init' first or navigate to the correct directory${NC}"
    exit 1
fi

# Check git status
echo -e "${BLUE}📊 Checking git status...${NC}"
git status --porcelain

# Add all new files
echo -e "${GREEN}📦 Adding all files to git...${NC}"
git add .

# Show what will be committed
echo -e "${BLUE}📋 Files to be committed:${NC}"
git status --short

# Prompt for commit message
echo -e "${YELLOW}💬 Enter commit message (or press Enter for default):${NC}"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="✨ Add React frontend with modern signup form

Features:
- 🎨 Multiple theme options (Default, Mocha, Glassmorphism)
- 🔐 Full JWT authentication integration
- 📱 Responsive mobile-first design
- ♿ WCAG accessibility compliant
- 🚀 Real-time validation and password strength
- 🛡️ Comprehensive error handling
- 📊 Protected routes and dashboard
- 🔧 Development tools and startup scripts

Components:
- SignupForm with theme switching
- LoginForm with validation
- Dashboard for authenticated users
- Auth hooks and API utilities
- Startup scripts for easy development"
fi

# Commit changes
echo -e "${GREEN}💾 Committing changes...${NC}"
git commit -m "$commit_message"

# Check if remote exists
if git remote -v | grep -q "origin"; then
    echo -e "${BLUE}🌐 Remote 'origin' found${NC}"
    
    # Push to GitHub
    echo -e "${GREEN}⬆️ Pushing to GitHub...${NC}"
    
    # Get current branch
    current_branch=$(git branch --show-current)
    echo -e "${BLUE}📍 Current branch: $current_branch${NC}"
    
    # Push
    if git push origin "$current_branch"; then
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        
        # Get remote URL
        remote_url=$(git remote get-url origin)
        if [[ $remote_url == *"github.com"* ]]; then
            # Convert SSH to HTTPS URL for display
            if [[ $remote_url == git@github.com:* ]]; then
                https_url="https://github.com/${remote_url#git@github.com:}"
                https_url="${https_url%.git}"
            else
                https_url=$remote_url
            fi
            echo -e "${BLUE}🔗 Repository URL: $https_url${NC}"
        fi
        
    else
        echo -e "${RED}❌ Failed to push to GitHub${NC}"
        echo -e "${YELLOW}💡 You may need to set up authentication or check your remote URL${NC}"
        exit 1
    fi
    
else
    echo -e "${YELLOW}⚠️ No remote 'origin' found${NC}"
    echo -e "${BLUE}💡 To add a GitHub remote, run:${NC}"
    echo -e "${GREEN}git remote add origin https://github.com/yourusername/your-repo-name.git${NC}"
    echo -e "${GREEN}git push -u origin main${NC}"
fi

echo -e "${GREEN}🎉 Repository update complete!${NC}"
echo -e "${BLUE}📁 Updated files include:${NC}"
echo -e "  ✅ React frontend components"
echo -e "  ✅ Authentication system"
echo -e "  ✅ Multiple themes"
echo -e "  ✅ Responsive design"
echo -e "  ✅ Development tools"
echo -e "  ✅ Documentation"
