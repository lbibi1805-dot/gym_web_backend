# 🧪 COMPREHENSIVE API TESTING GUIDE
**Gym Web Backend - Complete Testing Suite - UPDATED VERSION**

## 📋 TESTING OVERVIEW
This guide provides step-by-step testing for all API endpoints including:
- ✅ Authentication & Authorization
- ✅ User Management  
- ✅ OTP Password Reset System
- ✅ Workout Session Management (Individual Sessions)
- ✅ Admin Functions
- ✅ Cron Jobs & Email Services

---

## 🚀 SETUP & PREPARATION

### 1. Start Development Server
```bash
cd e:\Gym_Web\gym_web_backend
npm run dev
```

### 2. Verify Server Status
- **URL**: `GET http://localhost:3000/api/health`
- **Expected**: `{"status": "OK", "message": "Gym Web Backend API is running"}`

### 3. Testing Tools
- **Postman**: Import collection or manually test
- **Thunder Client**: VS Code extension
- **curl**: Command line testing

---

## 🔐 AUTHENTICATION FLOW TESTING

### TEST 1: User Registration
**Endpoint**: `POST http://localhost:3000/api/auth/register`
```json
{
    "name": "Test Client",
    "email": "testclient@example.com",
    "password": "TestPassword123!",
    "phone": "0123456789",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
}
```
**Expected**: Status 201, user created with JWT token
**Note**: User status will be "pending" - needs admin approval

### TEST 2: Admin Registration
**Endpoint**: `POST http://localhost:3000/api/auth/register`
```json
{
    "name": "Test Admin",
    "email": "testadmin@example.com", 
    "password": "AdminPassword123!",
    "phone": "0987654321",
    "dateOfBirth": "1985-01-01",
    "gender": "female",
    "role": "admin"
}
```
**Expected**: Status 201, admin created with JWT token

### TEST 3: User Login
**Endpoint**: `POST http://localhost:3000/api/auth/login`
```json
{
    "email": "testclient@example.com",
    "password": "TestPassword123!"
}
```
**Expected**: Status 200, JWT token returned
**Save the token as**: `{clientAccessToken}`

### TEST 4: Admin Login
**Endpoint**: `POST http://localhost:3000/api/auth/login`
```json
{
    "email": "testadmin@example.com",
    "password": "AdminPassword123!"
}
```
**Expected**: Status 200, JWT token returned
**Save the token as**: `{adminAccessToken}`

---

## 👥 USER MANAGEMENT TESTING

### TEST 5: Get User Profile
**Endpoint**: `GET http://localhost:3000/api/auth/profile`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 200, user profile data

### TEST 6: Update User Profile  
**Endpoint**: `PUT http://localhost:3000/api/users/profile`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "name": "Updated Client Name",
    "phone": "0111222333"
}
```
**Expected**: Status 200, profile updated

---

## 👑 ADMIN USER MANAGEMENT WORKFLOW

### 🔄 COMPLETE ADMIN WORKFLOW FOR USER APPROVAL

**Step 1: Admin checks for pending users**
```bash
GET http://localhost:3000/api/auth/pending-users
Headers: Authorization: Bearer {adminAccessToken}
```
**Response**: List of users with status "pending"

**Step 2: Admin reviews user details**
```bash
GET http://localhost:3000/api/auth/users
Headers: Authorization: Bearer {adminAccessToken}
```
**Response**: Complete list of all users with their details

**Step 3: Admin approves a user**
```bash
PUT http://localhost:3000/api/auth/users/status
Headers: Authorization: Bearer {adminAccessToken}
Content-Type: application/json

{
    "userId": "64f1c2e8a1234567890abcde",
    "status": "approved"
}
```
**Response**: `{ "success": true, "message": "User status updated to approved" }`

**Step 4: Admin rejects a user (if needed)**
```bash
PUT http://localhost:3000/api/auth/users/status
Headers: Authorization: Bearer {adminAccessToken}
Content-Type: application/json

{
    "userId": "64f1c2e8a1234567890abcde", 
    "status": "rejected"
}
```
**Response**: `{ "success": true, "message": "User status updated to rejected" }`

### 📋 ADMIN DAILY TASKS CHECKLIST
- [ ] Check pending users: `GET /api/auth/pending-users`
- [ ] Review user profiles: `GET /api/auth/users`
- [ ] Approve legitimate users: `PUT /api/auth/users/status` (approved)
- [ ] Reject suspicious users: `PUT /api/auth/users/status` (rejected)
- [ ] Monitor gym sessions: `GET /api/workout-sessions/admin/all`
- [ ] Handle user complaints (delete problematic sessions if needed)

### 🛠️ ADMIN TOOLS & SHORTCUTS

**Quick approve multiple users** (use in Postman/script):
```javascript
// Get all pending users first
const pendingUsers = await fetch('/api/auth/pending-users', {
    headers: { 'Authorization': 'Bearer ' + adminToken }
});

// Approve each user
for (let user of pendingUsers.data) {
    await fetch('/api/auth/users/status', {
        method: 'PUT',
        headers: { 
            'Authorization': 'Bearer ' + adminToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: user._id,
            status: 'approved'
        })
    });
}
```

**Batch operations for user management:**
1. **Filter users by status**: `GET /api/auth/users?status=pending`
2. **Get user count**: Check array length in response
3. **Bulk approve**: Use loop or batch API calls

### 🚨 ADMIN SECURITY NOTES
- ⚠️ **Never approve users without verification**
- ⚠️ **Admin cannot change other admin status** (protection built-in)
- ⚠️ **Always use proper authentication headers**
- ⚠️ **Monitor rejected users for suspicious activity**
- ⚠️ **Regular cleanup of old rejected user accounts**

### 🔧 TROUBLESHOOTING ADMIN OPERATIONS

**Problem**: "Cannot update admin status"
**Solution**: Admin users cannot have their status changed by other admins

**Problem**: "User not found"
**Solution**: Verify the userId is correct and user exists in database

**Problem**: "Access denied"
**Solution**: Ensure you're using admin token, not client token

**Problem**: Too many pending users
**Solution**: Set up email notifications for new registrations

---

## 👑 ADMIN FUNCTIONS TESTING

### TEST 7: Get All Users (Admin Only)
**Endpoint**: `GET http://localhost:3000/api/auth/users`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, list of all users

### TEST 8: Get Pending Users (Admin Only)
**Endpoint**: `GET http://localhost:3000/api/auth/pending-users`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, list of pending approval users

### TEST 9: Approve User (Admin Only)
**Endpoint**: `PUT http://localhost:3000/api/auth/users/status`
**Headers**: `Authorization: Bearer {adminAccessToken}`
```json
{
    "userId": "{clientUserId}",
    "status": "approved"
}
```
**Expected**: Status 200, user approved

### TEST 10: Reject User (Admin Only)
**Endpoint**: `PUT http://localhost:3000/api/auth/users/status`
**Headers**: `Authorization: Bearer {adminAccessToken}`
```json
{
    "userId": "{clientUserId}",
    "status": "rejected"
}
```
**Expected**: Status 200, user rejected

---

## 🔑 PASSWORD RESET TESTING

### TEST 11: Request Password Reset
**Endpoint**: `POST http://localhost:3000/api/auth/forgot-password`
```json
{
    "email": "testclient@example.com"
}
```
**Expected**: Status 200, OTP sent to email
**Check email for OTP code**

### TEST 12: Verify OTP
**Endpoint**: `POST http://localhost:3000/api/auth/verify-otp`
```json
{
    "email": "testclient@example.com",
    "otp": "123456"
}
```
**Expected**: Status 200, OTP verified
**Save the reset token**: `{resetToken}`

### TEST 13: Reset Password
**Endpoint**: `POST http://localhost:3000/api/auth/reset-password`
**Headers**: `Authorization: Bearer {resetToken}`
```json
{
    "newPassword": "NewPassword123!"
}
```
**Expected**: Status 200, password reset successful

### TEST 14: Login with New Password
**Endpoint**: `POST http://localhost:3000/api/auth/login`
```json
{
    "email": "testclient@example.com",
    "password": "NewPassword123!"
}
```
**Expected**: Status 200, login successful with new password

---

## 💪 WORKOUT SESSION MANAGEMENT TESTING

**Note**: Each session is for 1 person only, with max 8 overlapping sessions in the gym

### TEST 15: Create Workout Session (Client)
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Morning cardio session",
    "startTime": "2025-08-30T08:00:00.000Z",
    "endTime": "2025-08-30T09:00:00.000Z"
}
```
**Expected**: Status 201, session created
**Save session ID**: `{sessionId1}`

### TEST 16: Create Multiple Sessions (Test Capacity)
**Create 8 overlapping sessions to test capacity limit**
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Test session 2",
    "startTime": "2025-08-30T08:30:00.000Z",
    "endTime": "2025-08-30T09:30:00.000Z"
}
```
**Expected**: First 8 sessions should succeed, 9th should fail with capacity error

### TEST 17: Get All Sessions (Client can view all)
**Endpoint**: `GET http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 200, list of all gym sessions

### TEST 18: Get Sessions with Filters
**Endpoint**: `GET http://localhost:3000/api/workout-sessions?startDate=2025-08-30&endDate=2025-08-31`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 200, filtered sessions

### TEST 19: Update Own Session (Client)
**Endpoint**: `PUT http://localhost:3000/api/workout-sessions/{sessionId1}`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Updated morning cardio session",
    "startTime": "2025-08-30T08:15:00.000Z",
    "endTime": "2025-08-30T09:15:00.000Z"
}
```
**Expected**: Status 200, session updated

### TEST 20: Try Update Other's Session (Should Fail)
**Endpoint**: `PUT http://localhost:3000/api/workout-sessions/{otherUserSessionId}`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Trying to update other's session"
}
```
**Expected**: Status 403, access denied

### TEST 21: Delete Own Session (Client)
**Endpoint**: `DELETE http://localhost:3000/api/workout-sessions/{sessionId1}`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 200, session deleted

### TEST 22: Try Delete Other's Session (Should Fail)
**Endpoint**: `DELETE http://localhost:3000/api/workout-sessions/{otherUserSessionId}`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 403, access denied

---

## 👑 ADMIN SESSION MANAGEMENT TESTING

### TEST 23: Get All Sessions (Admin)
**Endpoint**: `GET http://localhost:3000/api/workout-sessions/admin/all`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, all sessions with admin view

### TEST 24: Get Sessions by Client (Admin)
**Endpoint**: `GET http://localhost:3000/api/workout-sessions/client/{clientUserId}`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, all sessions for specific client

### TEST 25: Delete Any Session (Admin)
**Endpoint**: `DELETE http://localhost:3000/api/workout-sessions/{anySessionId}`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, session deleted (admin can delete any session)

---

## 🚫 AUTHORIZATION TESTING

### TEST 26: Access Admin Endpoint as Client (Should Fail)
**Endpoint**: `GET http://localhost:3000/api/auth/users`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 403, access denied

### TEST 27: Access Protected Endpoint Without Token (Should Fail)
**Endpoint**: `GET http://localhost:3000/api/workout-sessions`
**Headers**: None
**Expected**: Status 401, authentication required

### TEST 28: Access with Invalid Token (Should Fail)
**Endpoint**: `GET http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer invalidtoken123`
**Expected**: Status 401, invalid token

### TEST 29: Access with Expired Token (Should Fail)
**Note**: Wait for token to expire or use expired token
**Endpoint**: `GET http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {expiredToken}`
**Expected**: Status 401, token expired

---

## 🔄 EDGE CASES & ERROR TESTING

### TEST 30: Register with Existing Email
**Endpoint**: `POST http://localhost:3000/api/auth/register`
```json
{
    "name": "Duplicate User",
    "email": "testclient@example.com",
    "password": "TestPassword123!"
}
```
**Expected**: Status 409, email already exists

### TEST 31: Login with Invalid Credentials
**Endpoint**: `POST http://localhost:3000/api/auth/login`
```json
{
    "email": "testclient@example.com",
    "password": "wrongpassword"
}
```
**Expected**: Status 401, invalid credentials

### TEST 32: Create Session with Invalid Time
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Invalid time session",
    "startTime": "2025-08-30T10:00:00.000Z",
    "endTime": "2025-08-30T09:00:00.000Z"
}
```
**Expected**: Status 400, end time before start time

### TEST 33: Create Session in the Past
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Past session",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": "2024-01-01T11:00:00.000Z"
}
```
**Expected**: Status 400, cannot create session in the past

---

## 📊 DATA VALIDATION TESTING

### TEST 34: Register with Invalid Email Format
**Endpoint**: `POST http://localhost:3000/api/auth/register`
```json
{
    "name": "Test User",
    "email": "invalid-email",
    "password": "TestPassword123!"
}
```
**Expected**: Status 400, invalid email format

### TEST 35: Register with Weak Password
**Endpoint**: `POST http://localhost:3000/api/auth/register`
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123"
}
```
**Expected**: Status 400, password too weak

### TEST 36: Create Session with Missing Fields
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {clientAccessToken}`
```json
{
    "notes": "Missing time fields"
}
```
**Expected**: Status 400, missing required fields

---

## 🎯 BUSINESS LOGIC TESTING

### TEST 37: Gym Capacity Enforcement
1. Create 8 overlapping sessions from different users
2. Try to create 9th overlapping session
**Expected**: 9th session should fail with capacity exceeded error

### TEST 38: Session Ownership Validation
1. User A creates a session
2. User B tries to modify User A's session
**Expected**: User B should get access denied

### TEST 39: Time Conflict Validation
1. Create a session from 10:00-11:00
2. Try to create another session from 10:30-11:30 (same user)
**Expected**: Should succeed (user can have multiple sessions)

### TEST 40: Admin Override Capabilities
1. Admin should be able to:
   - View all sessions
   - Delete any session
   - Access all admin endpoints
**Expected**: All admin operations should succeed

---

## 🕒 CRON JOB TESTING

### TEST 41: Session Cleanup Job
**Manual trigger**: Check if expired sessions are cleaned up
**Check**: Database should remove old sessions automatically

### TEST 42: Email Notification Job  
**Manual trigger**: Check if reminder emails are sent
**Check**: Users should receive session reminders

---

## 📈 PERFORMANCE TESTING

### TEST 43: Load Testing - Multiple Sessions
Create 50+ sessions concurrently to test:
- Database performance
- Server response time
- Memory usage

### TEST 44: Concurrent User Testing
Simulate multiple users:
- Creating sessions simultaneously
- Accessing different endpoints
- Testing race conditions

---

## 📝 TESTING CHECKLIST

### Authentication ✅
- [x] User registration
- [x] Admin registration  
- [x] User login
- [x] Admin login
- [x] Token validation
- [x] Password reset flow

### User Management ✅
- [x] Profile retrieval
- [x] Profile updates
- [x] Admin user management
- [x] User approval/rejection

### Workout Sessions ✅
- [x] Session creation
- [x] Session listing
- [x] Session updates (own only)
- [x] Session deletion (own only)
- [x] Admin session management
- [x] Gym capacity validation

### Authorization ✅
- [x] Role-based access control
- [x] JWT token verification
- [x] Admin-only endpoints
- [x] Client ownership validation

### Error Handling ✅
- [x] Invalid input validation
- [x] Authentication errors
- [x] Authorization errors
- [x] Business logic errors

---

## 🚀 QUICK TEST SEQUENCE

### For Development Testing:
1. Start server: `npm run dev`
2. Register admin user (TEST 2)
3. Register client user (TEST 1) 
4. Login as admin (TEST 4)
5. Approve client user (TEST 9)
6. Login as client (TEST 3)
7. Create workout session (TEST 15)
8. Test session management (TEST 17-21)

### For Production Testing:
1. Run all authentication tests (1-4)
2. Run all authorization tests (26-29)
3. Run all business logic tests (37-40)
4. Run edge case tests (30-36)
5. Verify all endpoints return expected responses

---

## 🏁 FINAL NOTES & CORRECT URLs

### ✅ CORRECT API ENDPOINTS:

#### Authentication:
- Register: `POST http://localhost:3000/api/auth/register`
- Login: `POST http://localhost:3000/api/auth/login`
- Profile: `GET http://localhost:3000/api/auth/profile`
- Forgot Password: `POST http://localhost:3000/api/auth/forgot-password`
- Verify OTP: `POST http://localhost:3000/api/auth/verify-otp`
- Reset Password: `POST http://localhost:3000/api/auth/reset-password`

#### Admin Functions:
- **Get All Users**: `GET http://localhost:3000/api/auth/users`
- **Get Pending Users**: `GET http://localhost:3000/api/auth/pending-users`  
- **Update User Status**: `PUT http://localhost:3000/api/auth/users/status`

#### User Management:
- Update Profile: `PUT http://localhost:3000/api/users/profile`

#### Workout Sessions:
- Create Session: `POST http://localhost:3000/api/workout-sessions`
- Get Sessions: `GET http://localhost:3000/api/workout-sessions`
- Update Session: `PUT http://localhost:3000/api/workout-sessions/{id}`
- Delete Session: `DELETE http://localhost:3000/api/workout-sessions/{id}`
- Get Client Sessions (Admin): `GET http://localhost:3000/api/workout-sessions/client/{clientId}`
- Get All Sessions (Admin): `GET http://localhost:3000/api/workout-sessions/admin/all`

#### System:
- Health Check: `GET http://localhost:3000/api/health`

---

### 🔧 Important Configuration:
- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json` for all POST/PUT requests
- **Authentication**: Use `Authorization: Bearer {token}` header
- **Session Logic**: Individual sessions (1 person each), max 8 overlapping
- **Business Rules**: Clients can view all sessions but only modify their own
- **Admin Powers**: Full access to all sessions and user management

**Remember**: Replace `{clientAccessToken}`, `{adminAccessToken}`, `{sessionId}`, etc. with actual values from your test responses!
