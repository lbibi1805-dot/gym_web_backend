# Gym Web Backend - Workout Session Booking System

A comprehensive gym booking system backend built with Node.js, Express.js, TypeScript, and MongoDB.

## Features

### User Management
- ✅ User registration with admin approval required
- ✅ JWT-based authentication
- ✅ Role-based access control (Client/Admin)
- ✅ User status management (Pending/Approved/Rejected/Suspended)

### Workout Session Booking
- ✅ Create, read, update, delete workout sessions
- ✅ Business rule validation:
  - Maximum 3 hours per session
  - Book within current and next week only
  - Maximum 1 session per client per day
  - Maximum 8 concurrent sessions gym-wide
- ✅ Client can only update their own sessions
- ✅ Admin can delete any session

### Security & Validation
- ✅ Input validation with Joi
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ MongoDB injection protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: bcrypt, helmet, cors
- **Development**: ts-node-dev, eslint, prettier

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gym_web_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gym_web
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

## API Documentation

See [GYM_API_DOCUMENTATION.md](./GYM_API_DOCUMENTATION.md) for complete API documentation with examples.

## Project Structure

```
gym_web_backend/
├── controllers/          # Request handlers
│   ├── auth.controllers.ts
│   ├── user.controllers.ts
│   └── workoutSession.controllers.ts
├── models/              # Database models
│   ├── user.models.ts
│   └── workoutSession.models.ts
├── services/            # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── workoutSession.service.ts
├── routes/              # API routes
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── workoutSession.routes.ts
│   └── index.ts
├── middlewares/         # Express middlewares
│   ├── auth.middleware.ts
│   ├── admin.middleware.ts
│   ├── approvedUser.middleware.ts
│   └── validation.middleware.ts
├── validation/          # Input validation schemas
│   ├── auth.validation.ts
│   └── workoutSession.validation.ts
├── types/              # TypeScript type definitions
│   ├── auth.types.ts
│   └── workoutSession.types.ts
├── enums/              # Enumerations
│   ├── userStatus.enums.ts
│   └── workoutSessionStatus.enums.ts
├── interfaces/         # TypeScript interfaces
│   ├── user.interfaces.ts
│   └── workoutSession.interfaces.ts
├── helpers/            # Utility functions
├── database/           # Database configuration
└── config/             # App configuration
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/pending-users` - Get pending users (Admin)
- `PUT /api/auth/users/status` - Update user status (Admin)
- `GET /api/auth/users` - Get all users (Admin)

### Workout Sessions
- `POST /api/workout-sessions` - Create session
- `GET /api/workout-sessions` - Get all sessions (Admin)
- `GET /api/workout-sessions/my` - Get user's sessions
- `GET /api/workout-sessions/:id` - Get session by ID
- `PUT /api/workout-sessions/:id` - Update session
- `DELETE /api/workout-sessions/:id` - Delete session (Admin)
- `GET /api/workout-sessions/client/:clientId` - Get client sessions (Admin)

## Business Rules

### User Management
1. New users register with "pending" status
2. Admin approval required before booking sessions
3. Admin can approve/reject/suspend users

### Session Booking
1. Sessions limited to 3 hours maximum
2. Booking window: current and next week only
3. One session per client per day
4. Maximum 8 concurrent sessions gym-wide
5. Only session owner can update sessions
6. Only admin can delete sessions

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/gym_web |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Development

1. Make sure MongoDB is running
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. The API will be available at `http://localhost:3000/api`

## Testing

Use the provided API testing guide in [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) for manual testing with tools like Postman or curl.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
