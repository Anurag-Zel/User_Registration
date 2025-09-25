# Backend API Structure

This backend follows the MVC (Model-View-Controller) architecture pattern for better organization and maintainability.

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (register, login)
│   └── userController.js    # User profile management
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Global error handling
│   ├── validation.js       # Input validation middleware
│   └── validators.js       # Validation rules
├── models/
│   └── User.js             # User data model and schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── user.js             # User profile routes
│   ├── health.js           # Health check route
│   └── index.js            # Main routes configuration
├── utils/                  # Utility functions (future use)
├── server.js               # Main server file
├── package.json
└── README.md
```

## Architecture Overview

### Models (`/models`)
- **User.js**: Defines the user schema, validation rules, and methods
- Contains Mongoose schema with pre-save hooks for password hashing
- Includes methods for password comparison and JWT token generation

### Controllers (`/controllers`)
- **authController.js**: Handles user registration and login
- **userController.js**: Manages user profile operations
- Contains business logic separated from routes

### Routes (`/routes`)
- **auth.js**: Authentication endpoints (`/api/auth/register`, `/api/auth/login`)
- **user.js**: User profile endpoints (`/api/user/profile`)
- **health.js**: Health check endpoint (`/api/health`)
- **index.js**: Main router that combines all route modules

### Middleware (`/middleware`)
- **auth.js**: JWT token authentication
- **validation.js**: Input validation error handling
- **validators.js**: Validation rules for different endpoints
- **errorHandler.js**: Global error handling and 404 handling

### Configuration (`/config`)
- **database.js**: MongoDB connection setup and configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile (requires authentication)
- `PUT /api/user/profile` - Update user profile (requires authentication)

### Health Check
- `GET /api/health` - API health status

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/recruitment_platform
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5001
NODE_ENV=development
```

## Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## Features

- **MVC Architecture**: Clean separation of concerns
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation with express-validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Helmet, CORS, rate limiting
- **Database**: MongoDB with Mongoose ODM
- **Password Security**: bcryptjs for password hashing

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation
- **express-validator**: Input validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart (dev dependency)
