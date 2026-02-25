const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { db, run, get, all } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Initialize default admin user if not exists
async function initializeAdmin() {
  try {
    const admin = await get('SELECT * FROM admin_users WHERE username = ?', ['admin']);
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await run('INSERT INTO admin_users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Default admin user created: admin / admin123');
    }
  } catch (err) {
    console.error('Error initializing admin:', err);
  }
}

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await get('SELECT * FROM admin_users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Content Routes
app.post('/api/auth/password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await get('SELECT * FROM admin_users WHERE id = ?', [req.user.id]);

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await run('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all content
app.get('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const content = await all('SELECT * FROM content WHERE section = ?', [section]);
    
    const contentObj = {};
    content.forEach(item => {
      contentObj[item.key] = item.value;
    });

    res.json(contentObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update content
app.post('/api/content/:section', authenticateToken, async (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await run(
        'INSERT OR REPLACE INTO content (section, key, value, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
        [section, key, value]
      );
    }

    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Portfolio Routes
app.get('/api/portfolio', async (req, res) => {
  try {
    const projects = await all('SELECT * FROM portfolio_projects ORDER BY featured DESC, created_at DESC');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/portfolio', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, image_url, project_url, featured } = req.body;

    const result = await run(
      'INSERT INTO portfolio_projects (title, description, category, image_url, project_url, featured) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, category, image_url, project_url, featured ? 1 : 0]
    );

    res.json({ id: result.lastID, message: 'Project created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/portfolio/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, image_url, project_url, featured } = req.body;

    await run(
      'UPDATE portfolio_projects SET title = ?, description = ?, category = ?, image_url = ?, project_url = ?, featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, category, image_url, project_url, featured ? 1 : 0, id]
    );

    res.json({ message: 'Project updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/portfolio/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await run('DELETE FROM portfolio_projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Contact Routes
app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const contacts = await all('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    await run(
      'INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );

    res.json({ message: 'Message received successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/contact/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await run(
      'UPDATE contact_submissions SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, async () => {
  await initializeAdmin();
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
