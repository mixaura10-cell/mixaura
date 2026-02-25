# Quick Start Guide - Mix Aura Admin Panel

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
Open PowerShell in your project folder and run:
```powershell
npm install
```

### Step 2: Start the Server
```powershell
npm start
```
You should see:
```
Server running on http://localhost:5000
Admin panel: http://localhost:5000/admin
Connected to SQLite database
Database tables initialized
```

### Step 3: Access Admin Panel
1. Open browser: `http://localhost:5000/admin`
2. Login with:
   - Username: **admin**
   - Password: **admin123**
3. Change your password immediately in Settings

---

## 📋 What You Can Do

### Edit Hero Section
- Go to **Hero Section** tab
- Modify headline and subheadline
- Click **Save Changes**

### Manage Services
- Go to **Services** tab
- Edit Digital Marketing and Web Development titles/descriptions
- Click **Save Changes**

### Manage Portfolio
- Go to **Portfolio** tab
- Click **+ Add Project** to add new projects
- Edit or delete existing projects
- Mark projects as "Featured"

### Track Contact Messages
- Go to **Contact Messages** tab
- View all contact form submissions
- Update message status (New, Read, Responded)
- See sender details and dates

### Security
- Go to **Settings** tab
- Change your admin password
- Use a strong password!

---

## 🔧 Configuration

Edit `.env` for production:
```
PORT=5000                          # Change if port is in use
JWT_SECRET=change-this-key         # MUST change for production
NODE_ENV=production
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `server.js` | Main API server & routes |
| `db.js` | Database setup & helpers |
| `admin.html` | Admin panel interface |
| `package.json` | Dependencies |
| `database.db` | SQLite database (auto-created) |

---

## ⚠️ Important Security Notes

1. **Change the default password** immediately after first login
2. Keep `JWT_SECRET` private - never share it
3. For production, use HTTPS
4. Regularly backup your database
5. Consider adding rate limiting and additional validation

---

## 🐛 Common Issues

**Port 5000 already in use?**
- Change PORT in .env file, or
- Kill the process using port 5000

**Can't connect to admin panel?**
- Check if server is running
- Verify no firewall is blocking port 5000
- Try http://localhost:5000/admin

**Password change not working?**
- Ensure you're logged in
- Check browser console for errors
- Verify server is running

---

## 📞 Need Help?

1. Check README.md for complete documentation
2. Review server console for error messages
3. Check admin panel network tab for API errors
4. Restart the server with `npm start`

---

**Ready to go?** Start by:
1. `npm install`
2. `npm start`
3. Visit `http://localhost:5000/admin`
4. Login & change your password

Enjoy your professional admin panel! 🎉
