#!/bin/bash

# Recruitment Platform Development Startup Script

echo "🚀 Starting Recruitment Platform Development Environment"
echo "=================================================="

# Check if MongoDB is running and start it if needed
echo "📊 Checking MongoDB connection..."

# Function to check if MongoDB is running
check_mongodb() {
    if command -v nc &> /dev/null; then
        nc -z localhost 27017 2>/dev/null
        return $?
    elif command -v netstat &> /dev/null; then
        netstat -an | grep "27017" | grep "LISTEN" > /dev/null
        return $?
    else
        # Fallback method
        timeout 1 bash -c 'cat < /dev/null > /dev/tcp/localhost/27017' 2>/dev/null
        return $?
    fi
}

if ! check_mongodb; then
    echo "🔄 MongoDB is not running. Starting MongoDB..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null && brew list mongodb-community &> /dev/null; then
            # If installed via Homebrew
            brew services start mongodb-community
        else
            # Direct start approach for macOS
            mkdir -p ~/data/db 2>/dev/null
            mongod --dbpath ~/data/db > /tmp/mongodb.log 2>&1 &
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        if [[ -d "C:/Program Files/MongoDB/Server" ]]; then
            # Find the latest version directory
            MONGO_VERSION=$(ls -d "C:/Program Files/MongoDB/Server/"*/ | sort -V | tail -1)
            if [[ -n "$MONGO_VERSION" ]]; then
                echo "Found MongoDB at $MONGO_VERSION"
                # Start MongoDB as a background process
                "${MONGO_VERSION}bin/mongod.exe" --dbpath "C:/data/db" > /tmp/mongodb.log 2>&1 &
            else
                echo "❌ MongoDB installation found but couldn't determine version."
                exit 1
            fi
        else
            echo "❌ MongoDB installation not found in standard location."
            echo "   Please start MongoDB manually or install it."
            exit 1
        fi
    else
        # Linux or other Unix-like
        if command -v systemctl &> /dev/null; then
            sudo systemctl start mongod
        elif command -v service &> /dev/null; then
            sudo service mongod start
        else
            # Direct start approach
            mkdir -p ~/data/db 2>/dev/null
            mongod --dbpath ~/data/db > /tmp/mongodb.log 2>&1 &
        fi
    fi
    
    # Wait for MongoDB to start
    echo "⏳ Waiting for MongoDB to start..."
    for i in {1..15}; do
        if check_mongodb; then
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
    
    # Verify MongoDB started successfully
    if ! check_mongodb; then
        echo "❌ Failed to start MongoDB. Please check MongoDB installation."
        echo "   You can check the logs at /tmp/mongodb.log"
        exit 1
    fi
fi
echo "✅ MongoDB is running"

# Install backend dependencies if needed
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install frontend dependencies if needed
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start backend server in background
echo "🔧 Starting backend server..."
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started successfully!"
echo "=================================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000/api"
echo "📊 MongoDB: mongodb://localhost:27017/recruitment_platform"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
