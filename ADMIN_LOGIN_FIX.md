# 🔐 Admin Login Fix Guide

## Problem
Admin login was failing because the seeded admin account didn't have `isVerified: true` flag, which is required by the login function.

## ✅ Solution - Run This Command

### Method 1: Quick Fix (Recommended)
```bash
cd backend
node createAdmin.js
```

This will:
- ✅ Create admin account (or update existing one)
- ✅ Set `isVerified: true`
- ✅ Set `role: 'admin'`
- ✅ Display login credentials

### Method 2: Reseed Database
```bash
cd backend
npm run seed
```

This will reseed the entire database with the fix applied.

---

## 🔐 Login Credentials

After running either method above, login with:

```
Email:    admin@wakeupcounseling.com
Password: Admin123@#$
```

**Login URL:** http://localhost:5173/login

---

## 🐛 Troubleshooting

### Error: "Your email was not verified"
**Cause:** The user account exists but `isVerified` is `false`

**Fix:** Run `node createAdmin.js` to update the account

### Error: "Invalid credentials"
**Possible causes:**
1. Password is incorrect (must be exactly: `Admin123@#$`)
2. User doesn't exist in database

**Fix:** 
```bash
cd backend
node createAdmin.js
```

### Error: "Cannot connect to server"
**Cause:** Backend is not running

**Fix:**
```bash
cd backend
npm run dev
```

### Backend running but still can't login?
**Check these:**
1. ✅ MongoDB is running/connected
2. ✅ Backend server is running on port 5000
3. ✅ Frontend is running on port 5173
4. ✅ No CORS errors in browser console

---

## 🔍 Verify Admin Account in Database

If you want to manually verify the account exists:

### Using MongoDB Compass:
1. Connect to your database
2. Go to `users` collection
3. Find user with email: `admin@wakeupcounseling.com`
4. Check these fields:
   - `role: "admin"`
   - `isVerified: true`

### Using MongoDB Shell:
```javascript
db.users.findOne({ email: "admin@wakeupcounseling.com" })
```

Should return:
```javascript
{
  _id: ObjectId("..."),
  fullName: "Admin Counselor",
  email: "admin@wakeupcounseling.com",
  role: "admin",
  isVerified: true,
  // ... other fields
}
```

---

## 📝 Manual Fix (If Scripts Don't Work)

If the automated scripts fail, manually update via MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@wakeupcounseling.com" },
  { 
    $set: { 
      isVerified: true,
      role: "admin"
    } 
  }
)
```

---

## 🔒 After First Login

**Important Security Steps:**

1. **Change Password Immediately**
   - Go to Profile → Change Password
   - Use a strong, unique password

2. **Update .env for Production**
   - Change `JWT_SECRET` to a random string
   - Update email credentials
   - Set `NODE_ENV=production`

3. **Remove Default Accounts**
   - Delete or disable demo accounts in production
   - Create proper admin accounts with strong passwords

---

## 📊 Testing the Fix

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend:**
```bash
cd frontend
npm run dev
```

3. **Run Admin Creation Script:**
```bash
cd backend
node createAdmin.js
```

4. **Login:**
- Go to: http://localhost:5173/login
- Email: `admin@wakeupcounseling.com`
- Password: `Admin123@#$`

5. **Verify Access:**
- Should redirect to `/admin` dashboard
- Check if you can see all admin features

---

## ✨ What Changed?

### Files Modified:
1. ✅ `backend/createAdmin.js` - New script to create/update admin
2. ✅ `backend/utils/seed.js` - Added `isVerified: true` to seeded users

### Code Changes:
```javascript
// OLD (in seed.js)
const admin = await User.create({
  fullName: 'Admin Counselor',
  email: 'admin@wakeupcounseling.com',
  password: 'Admin123@#$',
  phone: '+919876543210',
  role: 'admin'
  // ❌ Missing: isVerified: true
});

// NEW (fixed)
const admin = await User.create({
  fullName: 'Admin Counselor',
  email: 'admin@wakeupcounseling.com',
  password: 'Admin123@#$',
  phone: '+919876543210',
  role: 'admin',
  isVerified: true  // ✅ Added this
});
```

---

## 🎯 Quick Reference

| Action | Command |
|--------|---------|
| Create/Update Admin | `node createAdmin.js` |
| Reseed Database | `npm run seed` |
| Start Backend | `npm run dev` |
| Check Environment | `node check-env.js` |

---

## 🆘 Still Having Issues?

If you're still unable to login:

1. **Check backend logs** for errors
2. **Check browser console** for errors
3. **Verify MongoDB connection** in .env
4. **Try clearing browser cache** and cookies
5. **Try incognito mode**

---

You should now be able to login successfully! 🎉
