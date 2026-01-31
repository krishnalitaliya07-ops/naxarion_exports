# User Suspension Feature

## What Happens When a User is Suspended?

When an admin sets a user's status to "Suspended" (by setting `isActive: false`), the following happens:

### 1. **Immediate Account Lock**
- The user's `isActive` field is set to `false` in the database
- User cannot perform any authenticated actions

### 2. **Automatic Logout on Next Request**
The authentication middleware (`server/middleware/auth.js`) checks if the user is active:

```javascript
// Check if user is active
if (!req.user.isActive) {
  return res.status(403).json({
    success: false,
    message: 'Your account has been deactivated'
  });
}
```

### 3. **User Experience**
When a suspended user tries to:
- **Browse the website**: They will be blocked when they try any authenticated API call
- **Make a purchase**: Request will be rejected with "Your account has been deactivated"
- **Access dashboard**: Automatically logged out with error message
- **Login again**: Can login but will be blocked on first authenticated action

### 4. **Error Messages**
The user will see:
- Status Code: `403 Forbidden`
- Message: `"Your account has been deactivated"`

### 5. **Admin Control**
Admins can:
- **Suspend**: Set user to inactive (isActive = false)
- **Reactivate**: Set user back to active (isActive = true)
- This is reversible, unlike deletion

## Difference Between Suspended vs Deleted

| Action | Suspended (isActive: false) | Deleted |
|--------|---------------------------|---------|
| User data | Preserved | Permanently removed |
| Can be reversed | Yes | No |
| User experience | Blocked with message | Cannot login at all |
| Use case | Temporary restriction | Permanent removal |

## How to Toggle User Status

Admin can use the toggle button in the user management panel or make API call:
```
PATCH /api/admin/users/:id/toggle-active
```

This will flip the `isActive` status between `true` and `false`.
