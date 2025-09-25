#!/bin/bash

# Stop Development Servers Script
# This script stops both the backend and frontend development servers

echo "🛑 Stopping Recruitment Platform Development Servers"
echo "=================================================="

# Function to check if a process is running
check_process() {
    if pgrep -f "$1" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to stop processes gracefully
stop_process() {
    local process_name="$1"
    local port="$2"
    
    echo "🔍 Checking for $process_name processes..."
    
    if check_process "$process_name"; then
        echo "📱 Found $process_name processes, stopping..."
        
        # Try graceful shutdown first
        pkill -f "$process_name"
        sleep 2
        
        # Check if still running and force kill if necessary
        if check_process "$process_name"; then
            echo "⚠️  Graceful shutdown failed, force stopping..."
            pkill -9 -f "$process_name"
            sleep 1
        fi
        
        echo "✅ $process_name stopped successfully"
    else
        echo "ℹ️  No $process_name processes found"
    fi
    
    # Check if port is still in use
    if [ ! -z "$port" ]; then
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "🔧 Port $port still in use, cleaning up..."
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
            sleep 1
        fi
    fi
}

# Stop backend server (Node.js/Express)
echo ""
echo "🔧 Stopping Backend Server..."
stop_process "node.*server.js" "5001"
stop_process "nodemon.*server.js" "5001"

# Stop frontend server (React)
echo ""
echo "🎨 Stopping Frontend Server..."
stop_process "react-scripts" "3000"
stop_process "node.*start" "3000"

# Stop any remaining Node.js processes related to this project
echo ""
echo "🧹 Cleaning up any remaining project processes..."
pkill -f "Colbin_Assignment" 2>/dev/null || true

# Check if MongoDB is running and ask if user wants to stop it
echo ""
echo "📊 Checking MongoDB status..."
if brew services list | grep -q "mongodb-community.*started"; then
    echo "⚠️  MongoDB is still running"
    echo "   Database: recruitment_platform"
    echo "   Port: 27017"
    echo ""
    read -p "Do you want to stop MongoDB as well? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 Stopping MongoDB..."
        brew services stop mongodb/brew/mongodb-community
        echo "✅ MongoDB stopped"
    else
        echo "ℹ️  MongoDB left running"
    fi
else
    echo "ℹ️  MongoDB is not running"
fi

# Final status check
echo ""
echo "📋 Final Status Check:"
echo "====================="

# Check backend port
if lsof -ti:5001 > /dev/null 2>&1; then
    echo "❌ Backend port 5001: Still in use"
else
    echo "✅ Backend port 5001: Free"
fi

# Check frontend port
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "❌ Frontend port 3000: Still in use"
else
    echo "✅ Frontend port 3000: Free"
fi

# Check MongoDB port
if lsof -ti:27017 > /dev/null 2>&1; then
    echo "📊 MongoDB port 27017: Running"
else
    echo "📊 MongoDB port 27017: Stopped"
fi

echo ""
echo "🎉 Server shutdown complete!"
echo ""
echo "To restart the servers:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm start"
echo "  MongoDB:  brew services start mongodb/brew/mongodb-community"
echo ""
echo "Or use the start script: ./start-dev.sh"
