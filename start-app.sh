#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Modern Signup Form Application${NC}"
echo -e "${YELLOW}===============================================${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in the project root directory${NC}"
    echo -e "${YELLOW}Please run this script from the project root (Desktop/fun)${NC}"
    exit 1
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Check if backend port is available
if ! check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
    echo -e "${BLUE}ℹ️  This might be the backend server already running${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Aborted${NC}"
        exit 1
    fi
fi

# Start backend server
echo -e "${GREEN}🔧 Starting backend server...${NC}"
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the React development server
cd client
export PORT=3001
npm start &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Trap signals to cleanup
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}✅ Application started successfully!${NC}"
echo -e "${BLUE}📍 Backend API: http://localhost:3000${NC}"
echo -e "${BLUE}📍 Frontend App: http://localhost:3001${NC}"
echo -e "${YELLOW}⭐ Press Ctrl+C to stop both servers${NC}"

# Wait for processes
wait
