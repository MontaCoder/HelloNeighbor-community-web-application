# 🔐 Admin Setup Guide

## How to Create an Admin Account

Your app uses Supabase Auth with role-based access control. Here's how to become an admin:

---

## **Step 1: Run the Database Schema**

1. Go to https://app.supabase.com/project/hrmplyapfvzgcqignrhz
2. Navigate to **SQL Editor** 📝 (in left sidebar)
3. Click **"New query"**
4. Open `backup-fixed.sql` from your project
5. Copy **ALL** contents and paste into SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for success message ✅

---

## **Step 2: Create Your First User Account**

### Option A: Through the App (Recommended)
1. Start your dev server: `npm run dev`
2. Open http://localhost:5173
3. Click **"Sign Up"** or go to `/auth`
4. Enter your email and password
5. Click **"Sign Up"**
6. A profile will be automatically created for you

### Option B: Through Supabase Dashboard
1. Go to **Authentication** → **Users** in Supabase
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. Click **"Create user"**

---

## **Step 3: Make Your User an Admin**

After creating your account, you need to manually add admin role to the database:

### **Method 1: Using Supabase SQL Editor** (Easiest)

1. Get your **User ID** (UUID):
   - Go to **Authentication** → **Users**
   - Find your user and copy the **UID** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

2. Run this SQL query in **SQL Editor**:
   ```sql
   -- Replace 'YOUR_USER_ID_HERE' with your actual user UUID
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID_HERE', 'admin');
   ```

3. Click **"Run"** ✅

### **Method 2: Using Supabase Table Editor**

1. Go to **Table Editor** (in left sidebar)
2. Select the `user_roles` table
3. Click **"Insert row"**
4. Fill in:
   - `id`: Leave blank (auto-generated)
   - `user_id`: Paste your user UID from Authentication → Users
   - `role`: Select `admin` from dropdown
   - `created_at`: Leave blank (auto-filled)
5. Click **"Save"** ✅

---

## **Step 4: Test Admin Access**

1. Refresh your app or navigate to http://localhost:5173/admin
2. You should now see the **Admin Panel** with:
   - Neighborhood management
   - Create/Delete neighborhoods
   - System settings

---

## 🎯 **Quick SQL Script (Optional)**

If you want to create a test admin user in one go, run this in SQL Editor:

```sql
-- This script creates a test user and makes them admin
-- NOTE: Only use this for testing. Use the app's signup form for production.

-- Step 1: Create auth user (replace with your email/password)
-- Note: In production, use the app's signup form instead
-- SELECT auth.users_create('admin@test.com', 'your_secure_password');

-- Step 2: Get the user ID after creating it through the app
-- Then run:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR_USER_ID', 'admin');
```

---

## 🔍 **Verify Admin Status**

Run this query to check if you're an admin:

```sql
SELECT 
    u.email,
    ur.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
```

---

## ⚠️ **Important Notes**

1. **New User Signup**: When a user signs up through the app, a trigger automatically creates a profile for them
2. **Default Role**: New users don't get a role automatically (they're not in `user_roles` table)
3. **Admin Check**: The app uses `supabase.rpc('is_admin', { user_id })` to check admin status
4. **First Admin**: You MUST manually make the first user an admin using SQL or Table Editor
5. **Location Setup**: Admin users bypass the location verification step and go straight to `/admin`

---

## 🚀 **Post-Setup Checklist**

- [ ] Database schema executed successfully
- [ ] First user account created
- [ ] User added to `user_roles` with `admin` role
- [ ] Tested admin panel access at `/admin`
- [ ] Created at least one neighborhood (required for other features)
- [ ] Tested regular user signup and location verification

---

## 🆘 **Troubleshooting**

### Problem: "is_admin returns false even after inserting role"
**Solution**: 
- Make sure `user_id` matches exactly (check for typos)
- Run: `SELECT * FROM user_roles;` to verify the record exists
- Clear app cache and refresh

### Problem: "Can't access /admin route"
**Solution**:
- Admin route is protected - you must be logged in AND have admin role
- Check browser console for errors
- Verify `is_admin` RPC returns true: `SELECT is_admin('YOUR_USER_ID');`

### Problem: "Redirected to location setup instead of admin"
**Solution**:
- The `is_admin` query might be failing
- Check SQL Editor for any errors with the `is_admin` function
- Verify your user exists in both `auth.users` and `user_roles` tables
