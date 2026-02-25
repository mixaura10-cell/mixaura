# Mix Aura - Website Backend & Admin Panel

A professional backend system with a modern admin panel for managing your Mix Aura digital agency website. Built with Node.js, Express, and SQLite.

## Features

✨ **Professional Admin Panel**
- Modern, glassmorphic UI matching your website design
- Editable hero section, services, and portfolio
- Contact message management dashboard
- Real-time content updates

🔐 **Secure Authentication**
- JWT-based token authentication
- Password hashing with bcryptjs
- Session management
- Secure API endpoints

📊 **Content Management**
- Hero section customization
- Services management
- Portfolio project management (CRUD operations)
- Contact form submissions tracking
- Beautiful dashboard interface

🎨 **Design**
- Matches your website's purple/blue gradient aesthetic
- Responsive layout
- Smooth animations and transitions
- Glassmorphic design elements

## Setup Instructions

### 1. Install Dependencies

Open PowerShell in your project directory and run:

```bash
npm install
```

This installs all required packages:
- `express` - Web server framework
- `sqlite3` - Database
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `body-parser` - Request parsing

### 2. Configure Environment

The `.env` file is already configured. For production, change the `JWT_SECRET`:

```env
PORT=5000
JWT_SECRET=change-this-to-something-secure
NODE_ENV=production
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload (install nodemon first):

```bash
npm install -g nodemon
nodemon server.js
```

The server will start on: `http://localhost:5000`

### 4. Access the Admin Panel

Open your browser and go to:

```
http://localhost:5000/admin
```

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change the password immediately after first login via Settings → Change Password

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/password` - Change password (requires token)

### Content Management
- `GET /api/content/:section` - Get content for a section
- `POST /api/content/:section` - Update content (requires token)

### Portfolio Management
- `GET /api/portfolio` - Get all projects
- `POST /api/portfolio` - Create project (requires token)
- `PUT /api/portfolio/:id` - Update project (requires token)
- `DELETE /api/portfolio/:id` - Delete project (requires token)

### Contact Messages
- `GET /api/contact` - Get all messages (requires token)
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/:id` - Update message status (requires token)

## Admin Panel - Features Guide

### Hero Section
Edit your hero section headline and subheadline directly from the admin panel. Changes appear instantly.

### Services
Manage your service offerings:
- **Digital Marketing** - SEOP, PPC, Social Media, Content Strategy
- **Web Development** - React, Node.js, Custom CMS, E-commerce

### Portfolio
Create and manage your project portfolio:
- Add project title, description, category
- Upload project images
- Mark projects as featured
- View, edit, and delete projects

### Contact Messages
View all incoming contact form submissions:
- See sender details (name, email, phone)
- Read full messages
- Track message status (New, Read, Responded)
- Filter and organize inquiries

### Settings
- Change your admin password securely
- Access account settings

## Project Structure

```
Mix Aura/website/
├── server.js              # Main API server
├── db.js                  # Database setup and helpers
├── admin.html             # Admin panel interface
├── package.json           # Project dependencies
├── .env                   # Environment configuration
├── database.db            # SQLite database (auto-created)
└── index.html             # Your main website
```

## Database Schema

### admin_users
Stores admin user credentials

### content
Stores all editable page content (hero, services, etc.)

### portfolio_projects
Stores portfolio project information

### contact_submissions
Stores contact form submissions

## Modifying Your Website

To display content from the database on your main website, add this script to `index.html`:

```javascript
// Load content from backend
async function loadContent() {
  const heroContent = await fetch('/api/content/hero').then(r => r.json());
  document.getElementById('headline').textContent = heroContent.headline;
  document.getElementById('subheadline').textContent = heroContent.subheadline;
  
  const servicesContent = await fetch('/api/content/services').then(r => r.json());
  document.getElementById('marketingTitle').textContent = servicesContent.marketingTitle;
  document.getElementById('marketingDescription').textContent = servicesContent.marketingDescription;
  
  // Load portfolio
  const portfolio = await fetch('/api/portfolio').then(r => r.json());
  // Update portfolio section with projects from database
}

loadContent();
```

## Deployment

### Deploy to Heroku (Free Option)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment: `heroku config:set JWT_SECRET=your-secret-key`
5. Deploy: `git push heroku main`

### Deploy to Vercel, AWS, DigitalOcean

The server runs on any Node.js hosting platform. Just ensure:
- Environment variables are configured
- PORT variable is respected
- Database persistence (SQLite file location or MySQL)

## Security Best Practices

✅ **Do's**
- Change the default password immediately
- Use a strong SECRET_KEY
- Enable HTTPS in production
- Regularly update dependencies
- Backup your database

❌ **Don'ts**
- Don't expose your JWT_SECRET
- Don't commit `.env` with real secrets
- Don't use default credentials in production
- Don't allow direct database access

## Troubleshooting

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Database locked error:**
- Close other admin sessions
- Restart the server

**Login fails:**
- Ensure server is running
- Check token in network tab
- Clear browser cookies/cache

**CORS errors:**
- CORS is already enabled
- Check your fetch URLs match the server URL

## Support

For issues or questions:
1. Check the terminal for error messages
2. Review the database files
3. Ensure all dependencies are installed
4. Verify environment variables are set

## License

© 2025 Mix Aura. All rights reserved.
