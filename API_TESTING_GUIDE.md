# API Testing Guide - Gym Web Backend

## Overview
This guide provides comprehensive instructions for testing all API endpoints using Postman, including authentication, authorization, and failure cases.

**Base URL:** `http://localhost:3000/api`

---

## Table of Contents
1. [Setup Environment](#setup-environment)
2. [Health Check](#health-check)
3. [Authentication Endpoints](#authentication-endpoints)
4. [User Management Endpoints](#user-management-endpoints)  
5. [Workout Session Endpoints](#workout-session-endpoints)
6. [Admin Endpoints](#admin-endpoints)
7. [Error Handling & Failure Tests](#error-handling--failure-tests)
8. [Test Sequences](#test-sequences)
9. [JWT Token Management](#jwt-token-management)
10. [Postman Collection](#postman-collection)

---

## Setup Environment

### Postman Environment Variables
Create a new environment in Postman with these variables:
- `base_url`: `http://localhost:3000/api`
- `token`: (leave empty, will be auto-populated)
- `user_id`: (leave empty, will be auto-populated)
- `session_id`: (leave empty, will be auto-populated)
- `client_id`: (leave empty, will be auto-populated)

### Prerequisites
- Server running on `http://localhost:3000`
- MongoDB connection established
- Postman or similar REST client

---

## Health Check

### Check Server Status
```http
GET {{base_url}}/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "uptime": 123.456,
    "timestamp": "2025-08-25T10:30:45.123Z"
  }
}
```

---

## Authentication Endpoints

### 1. Sign Up (Register New User)

```http
POST http://localhost:3000/api/auth/sign-up
Content-Type: application/json

{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@gmail.com",
  "password": "Password123!",
  "phoneNumber": "0987654321",
  "dateOfBirth": "1990-01-15",
  "gender": "male"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "66cb123456789abcdef12345",
      "fullName": "Nguyen Van A",
      "email": "nguyenvana@gmail.com",
      "phoneNumber": "0987654321",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-08-25T10:30:45.123Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Postman Test Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.test("Sign up successful", function () {
        pm.expect(response.success).to.be.true;
        pm.expect(response.data.token).to.not.be.undefined;
    });
}
```

### 2. Sign In (Login)

```http
POST http://localhost:3000/api/auth/sign-in
Content-Type: application/json

{
  "email": "nguyenvana@gmail.com",
  "password": "Password123!"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "66cb123456789abcdef12345",
      "fullName": "Nguyen Van A",
      "email": "nguyenvana@gmail.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Postman Test Script:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.test("Sign in successful", function () {
        pm.expect(response.success).to.be.true;
        pm.expect(response.data.token).to.not.be.undefined;
    });
}
```

### 3. Change Password

```http
PUT http://localhost:3000/api/auth/change-password
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 4. Sign Out (Logout)

```http
POST http://localhost:3000/api/auth/sign-out
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Management Endpoints

### 1. Get Current User Profile

```http
GET http://localhost:3000/api/users/profile
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "66cb123456789abcdef12345",
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@gmail.com",
    "phoneNumber": "0987654321",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "gender": "male",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-08-25T10:30:45.123Z",
    "updatedAt": "2025-08-25T10:30:45.123Z"
  }
}
```

### 2. Update User Profile

```http
PUT http://localhost:3000/api/users/profile
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "fullName": "Nguyen Van A Updated",
  "phoneNumber": "0987654322",
  "dateOfBirth": "1990-01-20",
  "gender": "male"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "66cb123456789abcdef12345",
    "fullName": "Nguyen Van A Updated",
    "email": "nguyenvana@gmail.com",
    "phoneNumber": "0987654322",
    "dateOfBirth": "1990-01-20T00:00:00.000Z",
    "gender": "male",
    "role": "user",
    "isActive": true,
    "updatedAt": "2025-08-25T11:15:30.456Z"
  }
}
```

### 3. Get All Users (Admin Only)

```http
GET http://localhost:3000/api/users
Authorization: Bearer {{token}}

# With query parameters:
GET http://localhost:3000/api/users?page=1&limit=10&role=user&isActive=true
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "66cb123456789abcdef12345",
        "fullName": "Nguyen Van A",
        "email": "nguyenvana@gmail.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2025-08-25T10:30:45.123Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 4. Get User by ID (Admin Only)

```http
GET http://localhost:3000/api/users/66cb123456789abcdef12345
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "66cb123456789abcdef12345",
    "fullName": "Nguyen Van A",
    "email": "nguyenvana@gmail.com",
    "phoneNumber": "0987654321",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-08-25T10:30:45.123Z",
    "updatedAt": "2025-08-25T10:30:45.123Z"
  }
}
```

### 5. Update User by ID (Admin Only)

```http
PUT http://localhost:3000/api/users/66cb123456789abcdef12345
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "fullName": "Updated Name",
  "role": "admin",
  "isActive": false
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "66cb123456789abcdef12345",
    "fullName": "Updated Name",
    "role": "admin",
    "isActive": false,
    "updatedAt": "2025-08-25T11:20:15.789Z"
  }
}
```

### 6. Delete User (Admin Only)

```http
DELETE http://localhost:3000/api/users/66cb123456789abcdef12345
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Handling Tests

### 1. Validation Errors

#### Invalid Sign Up Data
```http
POST http://localhost:3000/api/auth/sign-up
Content-Type: application/json

{
  "fullName": "",
  "email": "invalid-email",
  "password": "123",
  "phoneNumber": "123",
  "dateOfBirth": "invalid-date",
  "gender": "unknown"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "fullName",
      "message": "Full name is required"
    },
    {
      "field": "email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

#### Invalid Sign In Credentials
```http
POST http://localhost:3000/api/auth/sign-in
Content-Type: application/json

{
  "email": "nguyenvana@gmail.com",
  "password": "WrongPassword"
}
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 2. Authentication Errors

#### Missing Token
```http
GET http://localhost:3000/api/users/profile
# No Authorization header
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Access token is required"
}
```

#### Invalid Token
```http
GET http://localhost:3000/api/users/profile
Authorization: Bearer invalid_token_here
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 3. Authorization Errors

#### User accessing Admin endpoint
```http
GET http://localhost:3000/api/users
Authorization: Bearer {{user_token}}
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```

### 4. Not Found Errors

#### Non-existent Route
```http
GET http://localhost:3000/api/nonexistent-endpoint
```

**Expected Response (404):**
```json
{
  "message": "Route not found"
}
```

#### Non-existent User
```http
GET http://localhost:3000/api/users/66cb999999999999999999999
Authorization: Bearer {{token}}
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Test Sequence

### Recommended Testing Order

1. **Health Check**
   ```http
   GET http://localhost:3000/api/health
   ```

2. **User Registration**
   ```http
   POST http://localhost:3000/api/auth/sign-up
   ```

3. **User Login**
   ```http
   POST http://localhost:3000/api/auth/sign-in
   ```

4. **Get Profile**
   ```http
   GET http://localhost:3000/api/users/profile
   ```

5. **Update Profile**
   ```http
   PUT http://localhost:3000/api/users/profile
   ```

6. **Change Password**
   ```http
   PUT http://localhost:3000/api/auth/change-password
   ```

7. **Admin Operations** (if admin user)
   ```http
   GET http://localhost:3000/api/users
   GET http://localhost:3000/api/users/{userId}
   PUT http://localhost:3000/api/users/{userId}
   DELETE http://localhost:3000/api/users/{userId}
   ```

8. **Logout**
   ```http
   POST http://localhost:3000/api/auth/sign-out
   ```

### Error Testing Sequence

1. **Validation Errors**
2. **Authentication Errors**
3. **Authorization Errors**
4. **Not Found Errors**

---

## JWT Token Management

### Auto Token Extraction (Postman)

Add this script to the **Tests** tab of Sign In and Sign Up requests:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        pm.environment.set("token", response.data.token);
        console.log("Token saved to environment");
    }
}
```

### Manual Token Usage

1. Copy token from login/signup response
2. Use in Authorization header: `Bearer YOUR_TOKEN_HERE`
3. Replace `YOUR_TOKEN_HERE` with actual token

### Token Format Example

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNiMTIzNDU2Nzg5YWJjZGVmMTIzNDUiLCJlbWFpbCI6Im5ndXllbnZhbmFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjQ1NjcxMjMsImV4cCI6MTcyNDY1MzUyM30.signature_hash
```

---

## Sample Test Data

### User Registration Data
```json
{
  "fullName": "Nguyen Van A",
  "email": "nguyenvana@gmail.com",
  "password": "Password123!",
  "phoneNumber": "0987654321",
  "dateOfBirth": "1990-01-15",
  "gender": "male"
}
```

### Profile Update Data
```json
{
  "fullName": "Nguyen Van A Updated",
  "phoneNumber": "0987654322",
  "dateOfBirth": "1990-01-20",
  "gender": "male"
}
```

### Password Change Data
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

---

## Troubleshooting

### Common Issues

1. **Server not running**: Ensure server is started with `npm run dev`
2. **Database connection**: Check MongoDB connection string
3. **CORS issues**: Verify CORS configuration in app.ts
4. **Token expired**: Re-login to get new token
5. **Invalid ObjectId**: Use valid MongoDB ObjectId format

### Debug Tips

- Check server logs for detailed error messages
- Verify all required fields are provided
- Ensure proper Content-Type headers
- Use valid MongoDB ObjectId format for user IDs
- Check token format and expiration

---

## Environment Setup

### Development
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gym_web
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
```

### Testing
```
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gym_web_test
JWT_SECRET=test_jwt_secret
JWT_EXPIRE=1h
```

---

*Last updated: August 25, 2025*
