# Integration Guide - Connecting Backend to Your Website

This guide shows how to integrate your backend API with your existing index.html to make your website content dynamic and manageable through the admin panel.

## Overview

Your website will now have two modes:
- **Static Mode**: If backend is unavailable, uses hardcoded content
- **Dynamic Mode**: If backend is available, loads content from database via API

## Step-by-Step Integration

### 1. Add Script to index.html

Add this line just before the closing `</body>` tag in your `index.html`:

```html
<!-- At the end of index.html, before </body> -->
<script src="/content-loader.js"></script>
```

The `content-loader.js` file is already created in your project.

### 2. Add Data Attributes to Elements

Add `id` attributes to the elements you want to be editable from the admin panel:

#### Hero Section (Already has IDs)
```html
<h1 id="headline" class="reveal-text text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
  We Build <span class="gradient-text">Digital Power.</span>
</h1>
<p id="subheadline" class="reveal-text reveal-text-delay-1 text-xl md:text-2xl text-gray-400 mb-12">
  Digital Marketing &amp; Web Development That Actually Converts.
</p>
```

#### Services Section (Already has IDs)
```html
<h3 id="marketingTitle" class="text-2xl md:text-3xl font-bold text-white">Digital Marketing</h3>
<p id="marketingDescription" class="text-gray-400 text-lg leading-relaxed mb-8">
  Performance-driven campaigns...
</p>

<h3 id="developmentTitle" class="text-2xl md:text-3xl font-bold text-white">Web Development</h3>
<p id="developmentDescription" class="text-gray-400 text-lg leading-relaxed mb-8">
  High-performance websites...
</p>
```

✅ **Good news**: Your index.html already has most of these IDs! The content-loader.js will automatically update them.

### 3. Integrate Contact Form

Find your contact form in index.html and update it:

**Original:**
```html
<form id="contactForm" class="space-y-6">
  <input name="name" type="text" placeholder="Your Name">
  <input name="email" type="email" placeholder="Your Email">
  <!-- ... other fields ... -->
</form>
```

**Updated:**
```html
<form id="contactForm" class="space-y-6" onsubmit="contentLoader.handleContactForm(event)">
  <input name="name" type="text" placeholder="Your Name" required>
  <input name="email" type="email" placeholder="Your Email" required>
  <input name="phone" type="tel" placeholder="Your Phone" />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>
```

### 4. Integrate Portfolio Dynamically (Optional)

For more advanced integration, add the portfolio grid:

```html
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="portfolioGrid">
  <!-- Portfolio items will be loaded here from backend -->
</div>
```

Then add this to `content-loader.js`:

```javascript
// Load Portfolio Projects dynamically
async function loadPortfolio() {
  const portfolio = await fetch(`${API_URL}/api/portfolio`).then(r => r.json());
  const portfolioGrid = document.getElementById('portfolioGrid');
  
  if (portfolioGrid && portfolio.length > 0) {
    portfolioGrid.innerHTML = portfolio.map(p => `
      <div class="portfolio-card rounded-2xl overflow-hidden cursor-pointer scroll-reveal group" onclick="openModal('${p.id}')">
        <div class="relative aspect-[4/3] overflow-hidden">
          <div class="portfolio-image absolute inset-0 flex items-center justify-center p-6" style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);">
            ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}" class="w-full h-full object-cover" />` : '<div class="text-white text-center"><h3 class="font-bold mb-2">' + p.title + '</h3><p>' + p.category + '</p></div>'}
          </div>
        </div>
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-xl font-bold mb-2">${p.title}</h3>
          <p class="text-gray-400 text-sm mb-4">${p.description || ''}</p>
          <span class="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">${p.category || 'Project'}</span>
        </div>
      </div>
    `).join('');
  }
}
```

### 5. Workflow

#### When Backend is Running:
1. User visits your website
2. `content-loader.js` fetches content from `/api/content/*`
3. Website displays content from database
4. Admin changes content in admin panel
5. Changes appear on website immediately

#### When Backend is Down (Fallback):
1. Fetch fails gracefully
2. Website displays static content from HTML
3. Console shows warning message
4. Users still see your website

## Testing the Integration

### Test Content Loading:

1. **Start your server:**
   ```bash
   npm start
   ```

2. **Open browser console (F12) and check for:**
   ```
   ✅ All content loaded from backend
   📡 Content loader initialized
   ```

3. **Go to admin panel:**
   ```
   http://localhost:5000/admin
   ```

4. **Change some content** (e.g., headline)

5. **Refresh your website** - you should see the updated content

### Test Contact Form:

1. Fill out the contact form on your website
2. Submit it
3. Go to admin panel → Contact Messages
4. You should see your message listed

## Advanced Customization

### Auto-Refresh Content (Optional)

Add this to `content-loader.js` to refresh content every 5 minutes:

```javascript
// Refresh content every 5 minutes
setInterval(loadWebsiteContent, 5 * 60 * 1000);
```

### Custom Sections

To add more editable sections:

1. **Admin Panel**: Add form in `admin.html` for your section
2. **Backend**: Add API endpoint in `server.js`
3. **Frontend**: Add fetch call in `content-loader.js`

Example for a new "About" section:

**Admin Panel (admin.html):**
```html
<div>
  <label class="block text-sm font-medium mb-2">About Section</label>
  <textarea id="aboutText" class="form-input w-full h-24"></textarea>
</div>
```

**Backend (server.js):**
```javascript
// Already handled by generic endpoint, just use:
POST /api/content/about
body: { text: "..." }
```

**Frontend (content-loader.js):**
```javascript
const aboutContent = await fetch(`${API_URL}/api/content/about`).then(r => r.json());
if (aboutContent.text) {
  document.getElementById('aboutText').textContent = aboutContent.text;
}
```

## Important Notes

### Security
- ✅ Backend is protected with JWT authentication
- ✅ Only logged-in admins can modify content
- ✅ Passwords are hashed with bcrypt
- ✅ Contact form submissions are validated

### Performance
- 📈 Content loads asynchronously (non-blocking)
- 🔄 Graceful fallback if API is unavailable
- 💾 Database is locally cached
- ⚡ Fast responses from SQLite

### Best Practices

1. **Always test in browser console** for errors
2. **Keep backend running** when testing
3. **Backup your database** before major changes
4. **Use HTTPS in production**
5. **Change default credentials** immediately
6. **Test contact form** thoroughly

## Troubleshooting

### Content not loading?
- Check browser console (F12) for errors
- Verify server is running: `npm start`
- Check that content-loader.js is linked in index.html
- Verify element IDs match in HTML

### Contact form not working?
- Check that form has correct `onsubmit` attribute
- Verify inputs have `name` attributes
- Check browser console for fetch errors
- Ensure backend is running

### CORS errors?
- CORS is already enabled in server.js
- If still having issues, check your fetch URL matches server URL

## Next Steps

1. ✅ Ensure backend is running: `npm start`
2. ✅ Visit admin panel: `http://localhost:5000/admin`
3. ✅ Login with: admin / admin123
4. ✅ Change password in Settings
5. ✅ Edit content in each tab
6. ✅ Test changes on your website
7. ✅ Setup contact form handling
8. ✅ Deploy to production

---

**That's it!** Your website is now fully integrated with a professional backend and admin system. Enjoy! 🚀
