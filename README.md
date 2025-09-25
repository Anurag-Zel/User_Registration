# Recruitment Platform Prototype

A full-stack recruitment platform prototype built with Node.js, Express.js, MongoDB, and React.js. This application provides user registration, authentication, and profile management functionality.

## Features

- **User Registration**: Users can sign up with email, password, and basic profile information
- **User Authentication**: JWT-based login system with secure password hashing
- **User Profile Management**: View and edit personal profile information
- **Account Deletion**: Secure account deletion with password confirmation
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Security**: Rate limiting, input validation, and secure authentication

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

## Project Structure

```
Colbin_Assignment/
├── backend/
│   ├── index.js          # Main server file
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Auth.css
│   │   │   └── Profile.css
│   │   ├── contexts/     # React contexts
│   │   │   └── AuthContext.js
│   │   ├── services/     # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json      # Frontend dependencies
├── .env                  # Environment variables
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Quick Start
You can use the provided scripts to quickly start the development environment:

```bash
# Start both frontend and backend servers (auto-starts MongoDB if needed)
./start-dev.sh

# Stop all running servers
./stop-servers.sh
```

The start script will automatically:
- Check if MongoDB is running and start it if needed (works on Windows, macOS, and Linux)
- Install dependencies if they're not already installed
- Start both backend and frontend servers

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/recruitment_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5001
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "profile": { ... },
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "profile": { ... },
      "lastLogin": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token"
  }
}
```

### User Endpoints

#### GET /user/profile
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "profile": { ... },
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /user/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Software Developer",
    "location": {
      "city": "New York",
      "country": "USA"
    }
  }
}
```

#### DELETE /user/profile
Delete user account (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "password": "user_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## New Features

### Account Deletion Feature
The application now includes a secure account deletion feature that allows users to permanently delete their accounts:

**Backend Implementation:**
- `DELETE /api/user/profile` endpoint with password verification
- Secure password validation before deletion
- Complete removal of user data from database

**Frontend Implementation:**
- Delete Account button in profile page
- Confirmation modal with warning messages
- Password verification step
- Automatic logout after successful deletion

**Security Features:**
- Password confirmation required
- Two-step confirmation process
- Clear warning about permanent data loss
- Secure token validation

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  profile: {
    firstName: String (required),
    lastName: String (required),
    phone: String (optional),
    location: {
      city: String (optional),
      country: String (optional)
    },
    bio: String (optional),
    skills: [String] (optional),
    experience: [{
      company: String (required),
      position: String (required),
      startDate: Date (required),
      endDate: Date (optional),
      current: Boolean (default: false),
      description: String (optional)
    }],
    education: [{
      institution: String (required),
      degree: String (required),
      field: String (optional),
      startDate: Date (required),
      endDate: Date (optional),
      current: Boolean (default: false)
    }]
  },
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Token Validation**: Middleware to verify JWT tokens on protected routes
- **Account Status**: Support for account activation/deactivation

### Input Validation
- **Email Validation**: Proper email format validation
- **Password Requirements**: Minimum 6 characters with complexity requirements
- **Data Sanitization**: Input sanitization and trimming
- **Length Limits**: Maximum length validation for all text fields

### Security Headers
- **Helmet.js**: Security headers for XSS protection, content type sniffing prevention
- **CORS**: Configured for specific origins in production
- **Rate Limiting**: 100 requests per 15 minutes per IP address

### Error Handling
- **Consistent Error Format**: Standardized error response structure
- **Validation Errors**: Detailed field-specific validation messages
- **Security**: No sensitive information exposed in error messages
- **Logging**: Server-side error logging for debugging

## API Structure and Design Decisions

### RESTful Design
- **Resource-based URLs**: Clear, intuitive endpoint structure
- **HTTP Methods**: Proper use of GET, POST, PUT for different operations
- **Status Codes**: Appropriate HTTP status codes for different scenarios

### Response Format
```json
{
  "success": boolean,
  "message": string,
  "data": object (optional),
  "errors": array (optional)
}
```

### Middleware Architecture
- **Authentication Middleware**: Centralized JWT token validation
- **Validation Middleware**: Reusable input validation with express-validator
- **Error Handling**: Global error handler for consistent error responses
- **Rate Limiting**: Applied to all API routes for DDoS protection

## Error Management

### Client-Side Error Handling
- **Form Validation**: Real-time validation with user-friendly messages
- **API Error Display**: Toast notifications for API errors
- **Network Error Handling**: Graceful handling of network failures
- **Authentication Errors**: Automatic logout on token expiration

### Server-Side Error Handling
- **Validation Errors**: Detailed field-specific error messages
- **Database Errors**: Proper handling of MongoDB connection and query errors
- **Authentication Errors**: Secure error messages without information leakage
- **Rate Limiting**: Clear messages when rate limits are exceeded

### Error Response Examples

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

**Authentication Error:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Scaling Suggestions

### Database Optimization
1. **Indexing**: Add indexes on frequently queried fields (email, createdAt)
2. **Connection Pooling**: Implement MongoDB connection pooling for better performance
3. **Database Sharding**: Consider horizontal sharding for large user bases
4. **Caching**: Implement Redis for session management and frequently accessed data

### API Scaling
1. **Load Balancing**: Use nginx or AWS ALB for request distribution
2. **API Gateway**: Implement API gateway for rate limiting and authentication
3. **Microservices**: Split into user service, profile service, etc.
4. **CDN**: Use CDN for static assets and API responses

### Security Enhancements
1. **OAuth Integration**: Add Google, LinkedIn OAuth for easier registration
2. **Two-Factor Authentication**: Implement 2FA using SMS or authenticator apps
3. **Audit Logging**: Track all user actions for security monitoring
4. **Encryption**: Encrypt sensitive data at rest and in transit

### Performance Optimization
1. **Caching**: Implement Redis caching for user profiles and sessions
2. **Database Optimization**: Use MongoDB aggregation pipelines for complex queries
3. **Image Upload**: Add file upload for profile pictures with image optimization
4. **Pagination**: Implement pagination for large data sets

### Monitoring & Analytics
1. **Application Monitoring**: Use tools like New Relic or DataDog
2. **Error Tracking**: Implement Sentry for error tracking and monitoring
3. **Performance Metrics**: Track API response times and database query performance
4. **User Analytics**: Track user behavior and feature usage

### Infrastructure
1. **Containerization**: Use Docker for consistent deployment environments
2. **Orchestration**: Implement Kubernetes for container orchestration
3. **CI/CD**: Set up automated testing and deployment pipelines
4. **Environment Management**: Separate development, staging, and production environments

## Development Commands

### Quick Start/Stop Scripts
```bash
# Start both servers (backend + frontend)
./start-dev.sh
# OR
npm run setup

# Stop both servers
./stop-servers.sh
# OR
npm run stop

# Install all dependencies
npm run install-all
```

### Backend
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
npm test       # Run tests (when implemented)
```

### Frontend
```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/recruitment_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5001
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Testing

To test the application:

1. **Start the backend server** (port 5001)
2. **Start the frontend server** (port 3000)
3. **Navigate to** `http://localhost:3000`
4. **Register a new account** or **login with existing credentials**
5. **View and edit your profile**
6. **Test account deletion** with the Delete Account button

## MongoDB Management

### Starting MongoDB
```bash
# Start MongoDB service (macOS with Homebrew)
brew services start mongodb/brew/mongodb-community

# Or start manually
mongod
```

### Stopping MongoDB
```bash
# Stop MongoDB service (macOS with Homebrew)
brew services stop mongodb/brew/mongodb-community

# Or stop manually
pkill mongod
```

### Database Management
- **Database Name**: `recruitment_platform`
- **Collection**: `users`
- **Connection String**: `mongodb://localhost:27017/recruitment_platform`

### Is it safe to disconnect MongoDB after the project?
**Yes, it's perfectly safe to stop MongoDB when you're done with the project.** Here's what you need to know:

1. **Development Data**: All data is stored locally and will be preserved
2. **No Data Loss**: Stopping MongoDB doesn't delete your data
3. **Easy Restart**: Simply restart MongoDB when you want to work on the project again
4. **Production Consideration**: In production, you'd use a managed MongoDB service (like MongoDB Atlas)

**To stop MongoDB:**
```bash
brew services stop mongodb/brew/mongodb-community
```

**To restart later:**
```bash
brew services start mongodb/brew/mongodb-community
```

## Development Scripts

The project includes convenient scripts for managing the development environment:

### Start Script (`start-dev.sh`)
- Automatically installs dependencies if needed
- Starts MongoDB (if not running)
- Starts backend server on port 5001
- Starts frontend server on port 3000
- Provides helpful status information

### Stop Script (`stop-servers.sh`)
- Gracefully stops both backend and frontend servers
- Cleans up any remaining processes
- Optionally stops MongoDB
- Provides status check of all ports
- Shows restart instructions

### Usage Examples
```bash
# Start everything
./start-dev.sh
# OR
npm run setup

# Stop everything
./stop-servers.sh
# OR
npm run stop

# Check what's running
ps aux | grep -E "(node|mongod)"

# Check specific ports
lsof -ti:5001  # Backend port
lsof -ti:3000  # Frontend port
lsof -ti:27017 # MongoDB port
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## Contact

For questions or support, please contact [Anurag Majumdar](mailto:anuragmajumdar941@gmail.com).
