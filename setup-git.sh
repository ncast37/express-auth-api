#!/bin/bash
# Git setup and push script for Express Auth API

echo "Setting up Git repository..."

# Navigate to project directory
cd /c/Users/nickc/Desktop/fun

# Initialize git if not already done
git init

# Add remote origin (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/express-auth-api.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Express.js Auth API with PostgreSQL

Features:
- JWT-based authentication (signup/login)
- PostgreSQL database with Docker
- Bcrypt password hashing
- Protected routes with middleware
- Input validation with express-validator
- Auto-migrations for database schema
- Comprehensive API documentation

Endpoints:
- POST /api/auth/signup - User registration
- POST /api/auth/login - User authentication  
- GET /api/auth/profile - Protected user profile
- POST /api/auth/logout - User logout

Tech Stack: Express.js, PostgreSQL, JWT, Docker, Bcrypt"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo "Project successfully pushed to GitHub!"
echo "Repository URL: https://github.com/YOUR_USERNAME/express-auth-api"
