# 🧪 COMPREHENSIVE API TESTING GUIDE
**Gym Web Backend - Complete Testing Suite**

## 📋 TESTING OVERVIEW
This guide provides step-by-step testing for all API endpoints including:
- ✅ Authentication & Authorization
- ✅ User Management
- ✅ OTP Password Reset System
- ✅ Workout Session Management
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
- **URL**: `GET http://localhost:3000/health`
- **Expected**: `{"status": "OK", "message": "Gym Web API is running"}`

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
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "phone": "0123456789",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
}
```
**Expected**: Status 201, user created with JWT token
**Note**: User status will be "PENDING" - needs admin approval

### TEST 1.5: Approve User (Required for Testing)
**Method**: Run approval script
```bash
node approve_user.js testuser@example.com
```
**Expected**: User status changed to "ACTIVE"
**⚠️ NOTE**: User status will be 'pending' and requires admin approval before login

### TEST 2: User Login (After Admin Approval)
**⚠️ IMPORTANT**: New users have `status: 'pending'` and cannot login until admin approval.

**Step 2A: Manual Admin Approval (Required)**
```javascript
// Connect to MongoDB and approve the user
// Option 1: MongoDB Compass/Shell
db.users.updateOne(
    { email: "testuser@example.com" },
    { $set: { status: "approved" } }
)

// Option 2: Database admin panel
// Set user status from 'pending' to 'approved'
```

**Step 2B: Login After Approval**
**Endpoint**: `POST http://localhost:3000/api/auth/login`
```json
{
    "email": "testuser@example.com",
    "password": "TestPassword123!"
}
```
**Expected**: Status 200, JWT token returned
**Save**: `accessToken` for subsequent requests

### TEST 2C: Test Pending User Login (Should Fail)
**Endpoint**: `POST http://localhost:3000/api/auth/login`
**Test with a user that hasn't been approved**
```json
{
    "email": "pendinguser@example.com", 
    "password": "TestPassword123!"
}
```
**Expected**: Status 403, "Your account is pending admin approval"

### TEST 3: Token Validation
**Endpoint**: `GET http://localhost:3000/api/auth/profile`
**Headers**: `Authorization: Bearer {accessToken}`
**Expected**: Status 200, user profile returned

---

## 🔑 OTP PASSWORD RESET TESTING

### TEST 4: Request Password Reset OTP
**Endpoint**: `POST http://localhost:3000/api/auth/forgot-password`
```json
{
    "email": "testuser@example.com"
}
```
**Expected**: 
- Status 200
- Message: "OTP sent to email"
- Check email for 6-digit OTP
- **Save**: OTP code from email

### TEST 5: Reset Password with OTP
**Endpoint**: `POST http://localhost:3000/api/auth/reset-password`
```json
{
    "email": "testuser@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123!"
}
```
**Expected**: Status 200, password reset success

### TEST 6: Login with New Password
**Endpoint**: `POST http://localhost:3000/api/auth/login`
```json
{
    "email": "testuser@example.com",
    "password": "NewPassword123!"
}
```
**Expected**: Status 200, successful login

### TEST 7: Invalid OTP Testing
**Endpoint**: `POST http://localhost:3000/api/auth/reset-password`
```json
{
    "email": "testuser@example.com",
    "otp": "000000",
    "newPassword": "AnotherPassword123!"
}
```
**Expected**: Status 400, "Invalid or expired OTP"

---

## 👥 USER MANAGEMENT TESTING

### TEST 8: Update User Profile
**Endpoint**: `PUT http://localhost:3000/api/users/profile`
**Headers**: `Authorization: Bearer {accessToken}`
```json
{
    "name": "Updated Test User",
    "phone": "0987654321",
    "dateOfBirth": "1992-06-15"
}
```
**Expected**: Status 200, profile updated

### TEST 9: Change Password
**Endpoint**: `PUT http://localhost:3000/api/users/change-password`
**Headers**: `Authorization: Bearer {accessToken}`
```json
{
    "currentPassword": "NewPassword123!",
    "newPassword": "FinalPassword123!"
}
```
**Expected**: Status 200, password changed

---

## 🏋️ WORKOUT SESSION TESTING

### TEST 10: Create Personal Workout Session
**Note**: User must be APPROVED first (run approve_user.js)
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {accessToken}`
```json
{
    "notes": "Personal cardio and strength training",
    "startTime": "2025-08-30T08:00:00.000Z",
    "endTime": "2025-08-30T09:00:00.000Z"
}
```
**Expected**: Status 201, session created for 1 person
**Business Rule**: Max 8 overlapping sessions allowed
**Save**: `sessionId`

### TEST 11: Create Another Overlapping Session (Test Capacity)
**Endpoint**: `POST http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {accessToken}`
```json
{
    "notes": "Weight lifting session",
    "startTime": "2025-08-30T08:30:00.000Z",
    "endTime": "2025-08-30T09:30:00.000Z"
}
```
**Expected**: Status 201, overlapping session allowed (under 8 capacity)

### TEST 12: Get All Sessions (Public View)
**Endpoint**: `GET http://localhost:3000/api/workout-sessions`
**Headers**: `Authorization: Bearer {accessToken}`
**Expected**: Status 200, list of ALL workout sessions from all users
**Note**: Clients can see all sessions (to know gym schedule) but can only modify their own

### TEST 12.1: Verify Session Ownership
**Check the response contains sessions from different users:**
```json
{
    "sessions": [
        {
            "id": "session1",
            "clientId": "user1_id",
            "clientName": "User One",
            "notes": "User 1's session",
            "startTime": "2025-08-30T08:00:00.000Z"
        },
        {
            "id": "session2", 
            "clientId": "user2_id",
            "clientName": "User Two",
            "notes": "User 2's session",
            "startTime": "2025-08-30T08:30:00.000Z"
        }
    ]
}
```

### TEST 13: Update Own Session (Should Work)
**Endpoint**: `PUT http://localhost:3000/api/workout-sessions/{ownSessionId}`
**Headers**: `Authorization: Bearer {accessToken}`
```json
{
    "notes": "Updated: Full body workout",
    "startTime": "2025-08-30T09:00:00.000Z",
    "endTime": "2025-08-30T10:00:00.000Z"
}
```
**Expected**: Status 200, session updated successfully

### TEST 13.1: Try Update Other's Session (Should Fail)
**Endpoint**: `PUT http://localhost:3000/api/workout-sessions/{otherUserSessionId}`
**Headers**: `Authorization: Bearer {accessToken}`
```json
{
    "notes": "Trying to hack someone's session",
    "startTime": "2025-08-30T10:00:00.000Z",
    "endTime": "2025-08-30T11:00:00.000Z"
}
```
**Expected**: Status 403 or 404, "Unauthorized" or "Session not found"

### TEST 14: Client Delete Own Session (Should Work)
**Endpoint**: `DELETE http://localhost:3000/api/workout-sessions/{ownSessionId}/client`
**Headers**: `Authorization: Bearer {accessToken}`
**Expected**: Status 200, session deleted with email notification

### TEST 14.1: Try Delete Other's Session (Should Fail)
**Endpoint**: `DELETE http://localhost:3000/api/workout-sessions/{otherUserSessionId}/client`
**Headers**: `Authorization: Bearer {accessToken}`
**Expected**: Status 403 or 404, "Unauthorized" or "Session not found"

### TEST 15: Test Gym Capacity Limit (Create 8+ Sessions)
**Create 8 sessions at same time to test capacity:**
**Endpoint**: `POST http://localhost:3000/api/workout-sessions` (repeat 8 times)
```json
{
    "notes": "Session #X",
    "startTime": "2025-08-30T14:00:00.000Z",
    "endTime": "2025-08-30T15:00:00.000Z"
}
```
**Expected**: First 8 sessions succeed, 9th session fails with capacity error

### TEST 16: Admin Delete Session
**Note**: Need admin user for this test
**Endpoint**: `DELETE http://localhost:3000/api/workout-sessions/{sessionId}/admin`
**Headers**: `Authorization: Bearer {adminAccessToken}`
```json
{
    "reason": "Gym equipment maintenance required"
}
```
**Expected**: Status 200, session deleted with email to client

---

## 👑 ADMIN AUTHORIZATION TESTING

### TEST 17: Admin User Creation
**Create admin user manually in database or promote existing user**
```bash
# Method 1: Create admin via registration then promote
POST /api/auth/register (create admin user)

# Method 2: Promote existing user in MongoDB
node approve_user.js admin@example.com
# Then manually update role in database:
# db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
```

### TEST 18: Admin-Only Endpoint Access
**Endpoint**: `GET http://localhost:3000/api/admin/users`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, list of all users

### TEST 19: Client Access Admin Endpoint (Should Fail)
**Endpoint**: `GET http://localhost:3000/api/admin/users`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 403, "Insufficient permissions"

### TEST 16: Admin User Management
**Get pending users and approve them**
**Endpoint**: `GET http://localhost:3000/api/admin/users?status=pending`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, list of pending users

**Approve User (Manual Database Update)**
```javascript
// MongoDB command to approve user
db.users.updateOne(
    { email: "pendinguser@example.com" },
    { $set: { status: "approved" } }
)
```

### TEST 17: Admin-Only Endpoint Access
**Endpoint**: `GET http://localhost:3000/api/admin/users`
**Headers**: `Authorization: Bearer {adminAccessToken}`
**Expected**: Status 200, list of all users

### TEST 18: Client Access Admin Endpoint (Should Fail)
**Endpoint**: `GET http://localhost:3000/api/admin/users`
**Headers**: `Authorization: Bearer {clientAccessToken}`
**Expected**: Status 403, "Insufficient permissions"

---

## 📧 EMAIL SERVICE TESTING

### TEST 18: Email Configuration Verification
Check server logs for:
```
✅ Email configuration verified successfully
```
If error appears, configure email credentials in `.env`

### TEST 19: OTP Email Delivery Test
1. Request password reset (TEST 4)
2. Check email inbox for OTP
3. Verify email content and formatting

### TEST 20: Session Cancellation Email Test
1. Book a session
2. Delete session as admin with reason
3. Check all participants receive cancellation email

---

## ⏰ CRON JOB TESTING

### TEST 21: OTP Cleanup Job Verification
1. Create multiple OTPs by requesting password reset
2. Wait 6+ minutes (OTP expires in 5 minutes)
3. Check server logs for:
```
[CRON] Cleaned X expired OTP records
```

### TEST 22: Manual Cron Job Trigger (Optional)
```javascript
// MongoDB command to check expired OTPs
db.otps.find({})

// Should show OTPs with expireAt field
// After 5+ minutes, expired ones should be auto-deleted
```

---

## 🛡️ SECURITY & ERROR HANDLING TESTING

### TEST 23: Rate Limiting
Make 100+ rapid requests to any endpoint
**Expected**: Status 429, "Too many requests"

### TEST 24: Invalid Token
**Endpoint**: Any protected endpoint
**Headers**: `Authorization: Bearer invalid_token`
**Expected**: Status 401, "Invalid token"

### TEST 25: Expired Token Testing
1. Use token after expiration time
2. **Expected**: Status 401, "Token expired"

### TEST 26: SQL Injection Prevention
Try malicious payloads in request bodies:
```json
{
    "email": "test@example.com'; DROP TABLE users; --",
    "password": "password"
}
```
**Expected**: Proper validation, no database corruption

---

## 📊 DATABASE VALIDATION TESTING

### TEST 27: MongoDB Connection Verification
Check server logs for:
```
MongoDB connected successfully: gymweb.fazh7yk.mongodb.net
```

### TEST 28: Database Indexes Verification
```javascript
// MongoDB commands
db.otps.getIndexes()  // Should show TTL index on expireAt
db.users.getIndexes() // Should show unique index on email
```

---

## 🔄 INTEGRATION TESTING

### TEST 29: Complete User Journey
1. Register new user
2. Login
3. Request password reset
4. Reset password with OTP
5. Login with new password
6. Book workout session
7. Cancel session
8. Update profile
9. Change password

### TEST 30: Admin Workflow
1. Login as admin
2. Create workout session
3. View all users
4. Delete session with email notification
5. Check email delivery

---

## 🚨 ERROR SCENARIOS TESTING

### Common Error Tests:
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Non-existent resources
- **409 Conflict**: Duplicate email registration
- **422 Validation Error**: Invalid input format
- **500 Internal Server Error**: Server issues

---

## 📈 PERFORMANCE TESTING

### Load Testing Suggestions:
1. **Concurrent Users**: 50-100 simultaneous requests
2. **Database Performance**: Query response times
3. **Email Delivery**: Bulk email sending
4. **Cron Job Efficiency**: Large dataset cleanup

---

## ✅ TESTING CHECKLIST

### Pre-Testing Setup:
- [ ] Server running on port 3000
- [ ] MongoDB connected successfully
- [ ] Email configuration verified
- [ ] Environment variables loaded

### Authentication & Authorization:
- [ ] User registration works
- [ ] User login returns valid token
- [ ] Token validation works
- [ ] Admin role checking works
- [ ] Permission boundaries respected

### OTP System:
- [ ] OTP generation and email delivery
- [ ] OTP validation and password reset
- [ ] OTP expiration (5 minutes)
- [ ] Invalid OTP rejection
- [ ] Cron job cleanup working

### Session Management:
- [ ] Session creation (admin)
- [ ] Session booking (client)
- [ ] Client self-deletion
- [ ] Admin deletion with notifications
- [ ] Email notifications working

### Security:
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CORS configured properly

### Database & Infrastructure:
- [ ] MongoDB connections stable
- [ ] TTL indexes working
- [ ] Data persistence verified
- [ ] Backup/restore procedures

---

## 🔧 TROUBLESHOOTING

### Common Issues:
1. **MongoDB Connection**: Check connection string and network
2. **Email Delivery**: Verify SMTP credentials and settings
3. **Token Issues**: Check JWT secret and expiration
4. **Permission Errors**: Verify user roles in database
5. **OTP Problems**: Check email delivery and TTL settings

### Debug Commands:
```bash
# Check server logs
npm run dev

# MongoDB connection test
mongosh "mongodb+srv://..."

# Email service test
node -e "console.log(process.env.EMAIL_HOST)"
```

---

## 📝 TEST RESULTS TEMPLATE

```
=== COMPREHENSIVE API TESTING RESULTS ===
Date: [DATE]
Tester: [NAME]
Environment: [DEV/STAGING/PROD]

AUTHENTICATION TESTS:
- Registration: [PASS/FAIL]
- Login: [PASS/FAIL]
- Token validation: [PASS/FAIL]
- Password reset: [PASS/FAIL]

OTP SYSTEM TESTS:
- OTP generation: [PASS/FAIL]
- Email delivery: [PASS/FAIL]
- OTP validation: [PASS/FAIL]
- Expiration cleanup: [PASS/FAIL]

SESSION MANAGEMENT TESTS:
- Session creation: [PASS/FAIL]
- Client booking: [PASS/FAIL]
- Client deletion: [PASS/FAIL]
- Admin deletion: [PASS/FAIL]

AUTHORIZATION TESTS:
- Admin access: [PASS/FAIL]
- Permission boundaries: [PASS/FAIL]
- Role validation: [PASS/FAIL]

SECURITY TESTS:
- Rate limiting: [PASS/FAIL]
- Input validation: [PASS/FAIL]
- Token security: [PASS/FAIL]

OVERALL STATUS: [PASS/FAIL]
NOTES: [Any issues or observations]
```

---

## 🎯 SUCCESS CRITERIA

**ALL SYSTEMS OPERATIONAL WHEN:**
- ✅ All authentication flows work smoothly
- ✅ OTP system sends emails and validates correctly
- ✅ Session management respects business rules
- ✅ Authorization boundaries are enforced
- ✅ Email notifications deliver reliably
- ✅ Cron jobs clean up expired data
- ✅ Database connections remain stable
- ✅ Security measures prevent attacks
- ✅ Error handling provides clear feedback
- ✅ Performance meets acceptable standards

**🎉 CONGRATULATIONS! Your Gym Web Backend is production-ready when all tests pass! 🎉**
