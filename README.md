# Gym Web Backend

A TypeScript Express.js backend API for gym management system.

## Features

- User authentication and authorization
- Event management
- Role-based access control
- Email notifications
- File upload support
- Cron job scheduling
- Comprehensive logging
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation
- Winston for logging
- Nodemailer for emails
- Multer for file uploads
- Agenda for job scheduling

## Project Structure

```
gym_web_backend/
├── bin/                    # Binary files
├── config/                 # Configuration files
├── controllers/            # Route controllers
├── cron/                   # Cron jobs and scheduling
├── database/               # Database configuration
├── email/                  # Email templates and configuration
├── enums/                  # TypeScript enums
├── helpers/                # Utility functions
├── interfaces/             # TypeScript interfaces
├── logs/                   # Log files
├── middlewares/            # Express middlewares
├── models/                 # Mongoose models
├── public/                 # Static files
├── routes/                 # API routes
├── services/               # Business logic
├── test/                   # Test files
├── types/                  # TypeScript type definitions
├── uploads/                # Uploaded files
├── validation/             # Input validation schemas
├── app.ts                  # Express app setup
└── app.js                  # Compiled Express app
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd gym_web_backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Start the development server
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start production server
- `npm test` - Run tests

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gym_web
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=http://localhost:3000
```

## API Documentation

API documentation will be available at `/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
