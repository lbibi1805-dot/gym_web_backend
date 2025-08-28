# 📚 API DOCUMENTATION
**Gym Web Backend - Complete API Reference**

---

## 📋 TABLE OF CONTENTS
- [Base Information](#base-information)
- [Business Rules & Use Cases](#business-rules--use-cases)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Workout Session Endpoints](#workout-session-endpoints)
- [System Endpoints](#system-endpoints)
- [Error Codes Reference](#error-codes-reference)

---

## 🌐 BASE INFORMATION

**Base URL**: `http://localhost:3000/api`
**Content-Type**: `application/json`
**Authentication**: `Authorization: Bearer {token}`

### Standard Response Format
```json
{
    "success": boolean,
    "statusCode": number,
    "message": string,
    "data": any | null
}
```

---

## � BUSINESS RULES & USE CASES

### 🏋️‍♂️ GYM BOOKING SYSTEM SPECIFICATION

This API serves a gym booking platform where clients can schedule individual workout sessions with capacity management and admin oversight.

---

### 👤 USER MANAGEMENT & AUTHENTICATION

#### **User Registration & Role Management**
- **Self-Registration**: Users can register accounts independently via API
- **Default Role**: All new registrations automatically receive "client" role  
- **Admin Creation**: Only possible through direct database modification (no API endpoint for admin creation by users)
- **Approval Process**: All new client accounts require admin approval before access
  - Status: `pending` → `approved` (by admin) → active access
  - Status: `pending` → `rejected` (by admin) → account denied

#### **Authentication Flow**
```
Registration → Pending Status → Admin Review → Approval/Rejection → Active/Denied Access
```

#### **Password Security**
- **Reset Mechanism**: OTP-based password reset via email
- **OTP Flow**: Request OTP → Verify OTP → Reset Password with token
- **Security**: Time-limited OTP codes with email verification

---

### 💪 WORKOUT SESSION MANAGEMENT

#### **Gym Capacity Rules**
- **Maximum Concurrent Sessions**: 8 overlapping workout sessions allowed at any time
- **Individual Sessions**: Each session accommodates exactly 1 person (client)
- **Capacity Enforcement**: API prevents booking when 8 sessions already overlap the requested time

#### **Booking Time Restrictions**
- **Booking Window**: Clients can only book sessions within a 2-week rolling window
  - Example: If current date is Week 1 of April 2025
  - Allowed booking range: Week 1 + Week 2 of April 2025
  - Cannot book beyond Week 2 or before current Week 1
- **Future Booking**: No bookings allowed beyond the 2-week limit
- **Past Booking**: No sessions can be created for past dates/times

#### **Session Duration & Frequency Limits**
- **Maximum Duration**: No single workout session can exceed 3 hours
- **Daily Limit**: Each client is restricted to 1 workout session per day
- **Validation**: API enforces these constraints during session creation

#### **Permission Matrix**

| Action | Client (Own Session) | Client (Other's Session) | Admin (Any Session) |
|--------|---------------------|-------------------------|-------------------|
| Create Session | ✅ Yes | ❌ N/A | ✅ Yes |
| View Sessions | ✅ All sessions visible | ✅ All sessions visible | ✅ All sessions visible |
| Update Session | ✅ Yes | ❌ Forbidden | ✅ Yes |
| Delete Session | ✅ Yes | ❌ Forbidden | ✅ Yes |

---

### 🔒 ACCESS CONTROL & AUTHORIZATION

#### **Role-Based Permissions**

**Client Permissions:**
- Create own workout sessions (within rules)
- View all gym sessions (public visibility)
- Update/delete only own sessions
- Update own profile information
- Request password reset

**Admin Permissions:**
- All client permissions +
- View all users and their details
- Approve/reject pending user accounts
- Delete any workout session
- View detailed admin analytics
- Manage gym capacity and scheduling conflicts

#### **Business Logic Enforcement**

**Session Creation Validation:**
1. User must have "approved" status
2. Session must be within 2-week booking window
3. Session duration must not exceed 3 hours
4. User cannot have another session on same day
5. Gym capacity (8 concurrent sessions) must not be exceeded
6. Session cannot be in the past

**User Account Lifecycle:**
```
Registration → pending → (Admin Action) → approved/rejected
approved → Can create sessions
rejected → Cannot access gym features
```

---

### 📅 SCHEDULING BUSINESS RULES

#### **Time Overlap Calculation**
- **Overlap Definition**: Two sessions overlap if any part of their time ranges intersect
- **Example Overlap**: 
  - Session A: 10:00-11:00
  - Session B: 10:30-11:30  
  - Result: These sessions overlap and count toward the 8-session limit

#### **Booking Window Logic**
- **Rolling Window**: 2-week window moves with current date
- **Week Definition**: Sunday to Saturday
- **Calculation**: Current week + next week = allowed booking range
- **Restriction Enforcement**: API rejects bookings outside this window

#### **Daily Session Restriction**
- **Definition**: One session per client per calendar day (00:00-23:59)
- **Timezone**: Server timezone used for day calculation
- **Enforcement**: API checks existing sessions for same client on same date

---

### 🔧 TECHNICAL IMPLEMENTATION DETAILS

#### **Session Status Management**
- **scheduled**: Future sessions awaiting execution
- **completed**: Past sessions marked as finished
- **cancelled**: Sessions cancelled by user or admin

#### **Capacity Management Algorithm**
1. Query all sessions overlapping with requested time range
2. Count active sessions (scheduled status)
3. If count >= 8, reject new booking
4. If count < 8, allow booking and create session

#### **Data Integrity Rules**
- **Unique Constraints**: Email addresses must be unique across all users
- **Referential Integrity**: All sessions must reference valid user accounts
- **Soft Deletion**: Cancelled sessions retained for audit purposes
- **Timestamp Validation**: Start time must be before end time

---

### 📊 BUSINESS METRICS & KPIs

#### **Gym Utilization Tracking**
- **Capacity Utilization**: Percentage of 8-session capacity used over time
- **Peak Hours**: Time periods with highest booking density  
- **User Activity**: Session frequency per client
- **Booking Patterns**: Lead time analysis for reservation trends

#### **Administrative Insights**
- **Pending Approvals**: Queue of users awaiting admin review
- **Rejected Accounts**: Analysis of rejection reasons and patterns
- **Session Cancellations**: Frequency and timing of cancelled bookings
- **System Usage**: API endpoint utilization and performance metrics

---

### ⚠️ CONSTRAINT VIOLATIONS & ERROR HANDLING

#### **Common Business Rule Violations**

**Capacity Exceeded (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Gym capacity exceeded. Maximum 8 overlapping sessions allowed.",
    "data": {
        "currentCapacity": 8,
        "maxCapacity": 8,
        "suggestedTimes": ["2025-08-30T09:00:00.000Z", "2025-08-30T14:00:00.000Z"]
    }
}
```

**Booking Window Violation (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Booking outside allowed 2-week window",
    "data": {
        "requestedDate": "2025-09-15",
        "allowedRange": {
            "start": "2025-08-25",
            "end": "2025-09-08"
        }
    }
}
```

**Daily Limit Exceeded (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Client already has a session scheduled for this date",
    "data": {
        "existingSession": {
            "id": "64f1c2e8a1234567890abce0",
            "date": "2025-08-30",
            "timeRange": "08:00-09:00"
        }
    }
}
```

**Session Duration Exceeded (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Session duration cannot exceed 3 hours",
    "data": {
        "requestedDuration": "4 hours 30 minutes",
        "maximumDuration": "3 hours"
    }
}
```

---

### 🎯 USE CASE SCENARIOS

#### **Scenario 1: New User Onboarding**
1. User registers account → Status: "pending"
2. Admin reviews registration → Approves account
3. User receives approval notification → Can now book sessions
4. User attempts first booking → Success (within all constraints)

#### **Scenario 2: Peak Hour Booking**
1. 7 clients already have overlapping sessions at 6:00 PM
2. 8th client books successfully → Gym at capacity
3. 9th client attempts booking → Rejected (capacity exceeded)
4. 9th client must choose different time slot

#### **Scenario 3: Booking Window Management**
1. Current date: August 25, 2025 (Week 1)
2. Client can book: August 25 - September 8 (Week 1 + Week 2)
3. Client attempts September 15 booking → Rejected (outside window)
4. Client must wait until September 1 to book September 15

#### **Scenario 4: Admin Session Management**
1. Client reports issue with another client's session
2. Admin reviews session details → Decides to cancel problematic session
3. Admin deletes session → Capacity freed for other bookings
4. Affected client receives notification of cancellation

---

## �🔐 AUTHENTICATION ENDPOINTS

### POST /auth/sign-up (or /auth/register)
**Description**: Register a new user or admin
**Authentication**: None required
**Note**: Both `/auth/sign-up` and `/auth/register` work identically

#### Request Body
```json
{
    "name": "string (required, min 2 chars)",
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars, 1 upper, 1 lower, 1 number, 1 special)",
    "phone": "string (required, valid phone)",
    "dateOfBirth": "string (required, YYYY-MM-DD format)",
    "gender": "string (required, 'male' | 'female' | 'other')",
    "role": "string (optional, 'client' | 'admin', default: 'client')"
}
```

#### Valid Response (201)
```json
{
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "64f1c2e8a1234567890abcde",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "client",
            "status": "pending",
            "createdAt": "2025-08-27T12:00:00.000Z"
        }
    }
}
```

#### Invalid Responses

**Validation Error (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Validation failed",
    "data": {
        "errors": [
            {
                "field": "email",
                "message": "Invalid email format"
            },
            {
                "field": "password",
                "message": "Password must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character"
            }
        ]
    }
}
```

**Email Already Exists (409)**
```json
{
    "success": false,
    "statusCode": 409,
    "message": "Email already exists",
    "data": null
}
```

---

### POST /auth/sign-in (or /auth/login)
**Description**: Login user/admin
**Authentication**: None required
**Note**: Both `/auth/sign-in` and `/auth/login` work identically

#### Request Body
```json
{
    "email": "string (required, valid email)",
    "password": "string (required)"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "64f1c2e8a1234567890abcde",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "client",
            "status": "approved"
        }
    }
}
```

#### Invalid Responses

**Invalid Credentials (401)**
```json
{
    "success": false,
    "statusCode": 401,
    "message": "Invalid email or password",
    "data": null
}
```

**Account Pending (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Account pending approval. Please wait for admin approval.",
    "data": null
}
```

**Account Rejected (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Account has been rejected. Please contact admin.",
    "data": null
}
```

---

### GET /auth/profile
**Description**: Get current user profile
**Authentication**: Required

#### Headers
```
Authorization: Bearer {token}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Profile retrieved successfully",
    "data": {
        "id": "64f1c2e8a1234567890abcde",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "0123456789",
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "gender": "male",
        "role": "client",
        "status": "approved",
        "createdAt": "2025-08-27T12:00:00.000Z",
        "updatedAt": "2025-08-27T12:00:00.000Z"
    }
}
```

#### Invalid Responses

**Unauthorized (401)**
```json
{
    "success": false,
    "statusCode": 401,
    "message": "Authentication token required",
    "data": null
}
```

**Invalid Token (401)**
```json
{
    "success": false,
    "statusCode": 401,
    "message": "Invalid or expired token",
    "data": null
}
```

---

### POST /auth/forgot-password
**Description**: Request password reset OTP
**Authentication**: None required

#### Request Body
```json
{
    "email": "string (required, valid email)"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "OTP sent to email successfully",
    "data": {
        "email": "john@example.com",
        "expiresAt": "2025-08-27T12:10:00.000Z"
    }
}
```

#### Invalid Responses

**User Not Found (404)**
```json
{
    "success": false,
    "statusCode": 404,
    "message": "User with this email does not exist",
    "data": null
}
```

**Email Service Error (500)**
```json
{
    "success": false,
    "statusCode": 500,
    "message": "Failed to send OTP email",
    "data": null
}
```

---

### POST /auth/verify-otp
**Description**: Verify OTP for password reset
**Authentication**: None required

#### Request Body
```json
{
    "email": "string (required, valid email)",
    "otp": "string (required, 6 digits)"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "OTP verified successfully",
    "data": {
        "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresAt": "2025-08-27T12:15:00.000Z"
    }
}
```

#### Invalid Responses

**Invalid OTP (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Invalid or expired OTP",
    "data": null
}
```

**OTP Expired (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "OTP has expired. Please request a new one",
    "data": null
}
```

---

### POST /auth/reset-password
**Description**: Reset password using reset token
**Authentication**: Reset token required

#### Headers
```
Authorization: Bearer {resetToken}
```

#### Request Body
```json
{
    "newPassword": "string (required, min 8 chars, 1 upper, 1 lower, 1 number, 1 special)"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Password reset successfully",
    "data": {
        "message": "Password has been reset. Please login with your new password"
    }
}
```

#### Invalid Responses

**Invalid Reset Token (401)**
```json
{
    "success": false,
    "statusCode": 401,
    "message": "Invalid or expired reset token",
    "data": null
}
```

**Weak Password (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Password must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    "data": null
}
```

---

## 👥 USER MANAGEMENT ENDPOINTS

### PUT /users/profile
**Description**: Update user profile
**Authentication**: Required

#### Headers
```
Authorization: Bearer {token}
```

#### Request Body
```json
{
    "name": "string (optional, min 2 chars)",
    "phone": "string (optional, valid phone)",
    "dateOfBirth": "string (optional, YYYY-MM-DD format)",
    "gender": "string (optional, 'male' | 'female' | 'other')"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Profile updated successfully",
    "data": {
        "id": "64f1c2e8a1234567890abcde",
        "name": "John Doe Updated",
        "email": "john@example.com",
        "phone": "0987654321",
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "gender": "male",
        "role": "client",
        "status": "approved",
        "updatedAt": "2025-08-27T12:30:00.000Z"
    }
}
```

#### Invalid Responses

**Validation Error (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Validation failed",
    "data": {
        "errors": [
            {
                "field": "phone",
                "message": "Invalid phone number format"
            }
        ]
    }
}
```

**Unauthorized (401)**
```json
{
    "success": false,
    "statusCode": 401,
    "message": "Authentication token required",
    "data": null
}
```

---

## 👑 ADMIN ENDPOINTS

### GET /auth/users
**Description**: Get all users (Admin only)
**Authentication**: Admin required

#### Headers
```
Authorization: Bearer {adminToken}
```

#### Query Parameters
```
status?: string (optional, 'pending' | 'approved' | 'rejected')
page?: number (optional, default: 1)
limit?: number (optional, default: 10)
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Users retrieved successfully",
    "data": {
        "users": [
            {
                "id": "64f1c2e8a1234567890abcde",
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "0123456789",
                "role": "client",
                "status": "approved",
                "createdAt": "2025-08-27T12:00:00.000Z"
            },
            {
                "id": "64f1c2e8a1234567890abcdf",
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "0987654321",
                "role": "client",
                "status": "pending",
                "createdAt": "2025-08-27T13:00:00.000Z"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalUsers": 2,
            "hasNext": false,
            "hasPrevious": false
        }
    }
}
```

#### Invalid Responses

**Access Denied (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Access denied. Admin privileges required",
    "data": null
}
```

---

### GET /auth/pending-users
**Description**: Get all pending users (Admin only)
**Authentication**: Admin required

#### Headers
```
Authorization: Bearer {adminToken}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Pending users retrieved successfully",
    "data": [
        {
            "id": "64f1c2e8a1234567890abcdf",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "0987654321",
            "dateOfBirth": "1992-05-15T00:00:00.000Z",
            "gender": "female",
            "role": "client",
            "status": "pending",
            "createdAt": "2025-08-27T13:00:00.000Z"
        }
    ]
}
```

#### Invalid Responses

**Access Denied (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Access denied. Admin privileges required",
    "data": null
}
```

---

### PUT /auth/users/status
**Description**: Update user status (Admin only)
**Authentication**: Admin required

#### Headers
```
Authorization: Bearer {adminToken}
```

#### Request Body
```json
{
    "userId": "string (required, valid ObjectId)",
    "status": "string (required, 'approved' | 'rejected')"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "User status updated successfully",
    "data": {
        "message": "User status updated to approved"
    }
}
```

#### Invalid Responses

**User Not Found (404)**
```json
{
    "success": false,
    "statusCode": 404,
    "message": "User not found",
    "data": null
}
```

**Cannot Update Admin (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Cannot update admin status",
    "data": null
}
```

**Invalid Status (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Invalid status. Must be 'approved' or 'rejected'",
    "data": null
}
```

---

## 💪 WORKOUT SESSION ENDPOINTS

### POST /workout-sessions
**Description**: Create a workout session
**Authentication**: Required (Approved users only)

#### Headers
```
Authorization: Bearer {token}
```

#### Request Body
```json
{
    "notes": "string (optional, max 500 chars)",
    "startTime": "string (required, ISO 8601 format)",
    "endTime": "string (required, ISO 8601 format)"
}
```

#### Valid Response (201)
```json
{
    "success": true,
    "statusCode": 201,
    "message": "Workout session created successfully",
    "data": {
        "id": "64f1c2e8a1234567890abce0",
        "clientId": "64f1c2e8a1234567890abcde",
        "clientName": "John Doe",
        "notes": "Morning cardio session",
        "startTime": "2025-08-30T08:00:00.000Z",
        "endTime": "2025-08-30T09:00:00.000Z",
        "status": "scheduled",
        "createdAt": "2025-08-27T12:00:00.000Z",
        "updatedAt": "2025-08-27T12:00:00.000Z"
    }
}
```

#### Invalid Responses

**Gym Capacity Exceeded (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Gym capacity exceeded. Maximum 8 overlapping sessions allowed.",
    "data": {
        "currentCapacity": 8,
        "maxCapacity": 8,
        "conflictingTime": {
            "start": "2025-08-30T08:00:00.000Z",
            "end": "2025-08-30T09:00:00.000Z"
        }
    }
}
```

**Invalid Time Range (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "End time must be after start time",
    "data": null
}
```

**Past Date Error (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Cannot create session in the past",
    "data": null
}
```

**User Not Approved (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "User account not approved. Please wait for admin approval.",
    "data": null
}
```

---

### GET /workout-sessions
**Description**: Get workout sessions with filters
**Authentication**: Required

#### Headers
```
Authorization: Bearer {token}
```

#### Query Parameters
```
startDate?: string (optional, YYYY-MM-DD format)
endDate?: string (optional, YYYY-MM-DD format)
status?: string (optional, 'scheduled' | 'completed' | 'cancelled')
page?: number (optional, default: 1)
limit?: number (optional, default: 10)
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Workout sessions retrieved successfully",
    "data": {
        "sessions": [
            {
                "id": "64f1c2e8a1234567890abce0",
                "clientId": "64f1c2e8a1234567890abcde",
                "clientName": "John Doe",
                "notes": "Morning cardio session",
                "startTime": "2025-08-30T08:00:00.000Z",
                "endTime": "2025-08-30T09:00:00.000Z",
                "status": "scheduled",
                "createdAt": "2025-08-27T12:00:00.000Z"
            },
            {
                "id": "64f1c2e8a1234567890abce1",
                "clientId": "64f1c2e8a1234567890abcdf",
                "clientName": "Jane Smith",
                "notes": "Evening strength training",
                "startTime": "2025-08-30T18:00:00.000Z",
                "endTime": "2025-08-30T19:00:00.000Z",
                "status": "scheduled",
                "createdAt": "2025-08-27T13:00:00.000Z"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalSessions": 2,
            "hasNext": false,
            "hasPrevious": false
        }
    }
}
```

#### Invalid Responses

**Invalid Date Format (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Invalid date format. Use YYYY-MM-DD",
    "data": null
}
```

---

### PUT /workout-sessions/{id}
**Description**: Update workout session (Own sessions only)
**Authentication**: Required

#### Headers
```
Authorization: Bearer {token}
```

#### Path Parameters
```
id: string (required, valid ObjectId)
```

#### Request Body
```json
{
    "notes": "string (optional, max 500 chars)",
    "startTime": "string (optional, ISO 8601 format)",
    "endTime": "string (optional, ISO 8601 format)"
}
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Workout session updated successfully",
    "data": {
        "id": "64f1c2e8a1234567890abce0",
        "clientId": "64f1c2e8a1234567890abcde",
        "clientName": "John Doe",
        "notes": "Updated morning cardio session",
        "startTime": "2025-08-30T08:15:00.000Z",
        "endTime": "2025-08-30T09:15:00.000Z",
        "status": "scheduled",
        "updatedAt": "2025-08-27T12:30:00.000Z"
    }
}
```

#### Invalid Responses

**Session Not Found (404)**
```json
{
    "success": false,
    "statusCode": 404,
    "message": "Workout session not found",
    "data": null
}
```

**Access Denied (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Access denied. You can only update your own sessions",
    "data": null
}
```

**Invalid Session ID (400)**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Invalid session ID format",
    "data": null
}
```

---

### DELETE /workout-sessions/{id}
**Description**: Delete workout session (Own sessions only, Admin can delete any)
**Authentication**: Required

#### Headers
```
Authorization: Bearer {token}
```

#### Path Parameters
```
id: string (required, valid ObjectId)
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Workout session deleted successfully",
    "data": null
}
```

#### Invalid Responses

**Session Not Found (404)**
```json
{
    "success": false,
    "statusCode": 404,
    "message": "Workout session not found",
    "data": null
}
```

**Access Denied (403)**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Access denied. You can only delete your own sessions",
    "data": null
}
```

---

### GET /workout-sessions/admin/all
**Description**: Get all sessions with admin view (Admin only)
**Authentication**: Admin required

#### Headers
```
Authorization: Bearer {adminToken}
```

#### Query Parameters
```
startDate?: string (optional, YYYY-MM-DD format)
endDate?: string (optional, YYYY-MM-DD format)
clientId?: string (optional, valid ObjectId)
status?: string (optional, 'scheduled' | 'completed' | 'cancelled')
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "All workout sessions retrieved successfully",
    "data": {
        "sessions": [
            {
                "id": "64f1c2e8a1234567890abce0",
                "client": {
                    "id": "64f1c2e8a1234567890abcde",
                    "name": "John Doe",
                    "email": "john@example.com",
                    "phone": "0123456789"
                },
                "notes": "Morning cardio session",
                "startTime": "2025-08-30T08:00:00.000Z",
                "endTime": "2025-08-30T09:00:00.000Z",
                "status": "scheduled",
                "createdAt": "2025-08-27T12:00:00.000Z",
                "updatedAt": "2025-08-27T12:00:00.000Z"
            }
        ],
        "totalSessions": 1,
        "capacityInfo": {
            "currentCapacity": 1,
            "maxCapacity": 8,
            "availableSlots": 7
        }
    }
}
```

---

### GET /workout-sessions/client/{clientId}
**Description**: Get all sessions for specific client (Admin only)
**Authentication**: Admin required

#### Headers
```
Authorization: Bearer {adminToken}
```

#### Path Parameters
```
clientId: string (required, valid ObjectId)
```

#### Valid Response (200)
```json
{
    "success": true,
    "statusCode": 200,
    "message": "Client sessions retrieved successfully",
    "data": {
        "client": {
            "id": "64f1c2e8a1234567890abcde",
            "name": "John Doe",
            "email": "john@example.com"
        },
        "sessions": [
            {
                "id": "64f1c2e8a1234567890abce0",
                "notes": "Morning cardio session",
                "startTime": "2025-08-30T08:00:00.000Z",
                "endTime": "2025-08-30T09:00:00.000Z",
                "status": "scheduled",
                "createdAt": "2025-08-27T12:00:00.000Z"
            }
        ],
        "totalSessions": 1
    }
}
```

#### Invalid Responses

**Client Not Found (404)**
```json
{
    "success": false,
    "statusCode": 404,
    "message": "Client not found",
    "data": null
}
```

---

## 🏥 SYSTEM ENDPOINTS

### GET /health
**Description**: Health check endpoint
**Authentication**: None required

#### Valid Response (200)
```json
{
    "status": "OK",
    "message": "Gym Web Backend API is running",
    "timestamp": "2025-08-27T12:00:00.000Z"
}
```

---

## ❌ ERROR CODES REFERENCE

### HTTP Status Codes Used

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Authentication required or token invalid |
| 403 | Forbidden | Access denied or insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

### Common Error Response Formats

**Validation Error**
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Validation failed",
    "data": {
        "errors": [
            {
                "field": "fieldName",
                "message": "Error description"
            }
        ]
    }
}
```

**Authentication Error**
```json
{
    "success": false,
    "statusCode": 401,
    "message": "Authentication token required",
    "data": null
}
```

**Authorization Error**
```json
{
    "success": false,
    "statusCode": 403,
    "message": "Access denied",
    "data": null
}
```

**Not Found Error**
```json
{
    "success": false,
    "statusCode": 404,
    "message": "Resource not found",
    "data": null
}
```

**Server Error**
```json
{
    "success": false,
    "statusCode": 500,
    "message": "Internal server error",
    "data": null
}
```

---

## 🔧 REQUEST EXAMPLES

### Using cURL

**Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "StrongPassword123!",
    "phone": "0123456789",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongPassword123!"
  }'
```

**Create Session**
```bash
curl -X POST http://localhost:3000/api/workout-sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "notes": "Morning cardio session",
    "startTime": "2025-08-30T08:00:00.000Z",
    "endTime": "2025-08-30T09:00:00.000Z"
  }'
```

### Using JavaScript/Fetch

**Register User**
```javascript
const registerUser = async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPassword123!',
      phone: '0123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    })
  });
  
  const data = await response.json();
  return data;
};
```

**Get Sessions with Auth**
```javascript
const getSessions = async (token) => {
  const response = await fetch('http://localhost:3000/api/workout-sessions', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
};
```

---

## 📝 VALIDATION RULES

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

### Email Format
- Must be valid email format
- Example: `user@domain.com`

### Phone Format
- Vietnamese phone format
- Examples: `0123456789`, `+84123456789`

### Date Format
- ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Date only format: `YYYY-MM-DD`

### ObjectId Format
- MongoDB ObjectId: 24 character hex string
- Example: `64f1c2e8a1234567890abcde`

---

## 🚀 RATE LIMITING

**Current Limits:**
- 100 requests per 15 minutes per IP
- Apply to all endpoints

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1693123200
```

**Rate Limit Exceeded Response (429)**
```json
{
    "success": false,
    "statusCode": 429,
    "message": "Too many requests. Please try again later.",
    "data": {
        "retryAfter": 900
    }
}
```

---

## 🔒 SECURITY NOTES

1. **Authentication**: All protected endpoints require valid JWT token
2. **Authorization**: Role-based access control (client/admin)
3. **CORS**: Configured for specific origins
4. **Helmet**: Security headers enabled
5. **Rate Limiting**: Protection against abuse
6. **Input Validation**: All inputs validated and sanitized
7. **Password Hashing**: Bcrypt with salt rounds
8. **JWT Security**: Proper token expiration and validation

---

## 📞 SUPPORT

For API questions or issues:
- Check error messages in response
- Verify request format matches documentation
- Ensure proper authentication headers
- Review validation requirements
- Contact development team for technical support

**Last Updated**: August 27, 2025
