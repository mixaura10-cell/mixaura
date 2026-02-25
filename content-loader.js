// content-loader.js
// This script loads content from the backend API and updates the website dynamically
// Add this to your index.html just before the closing </body> tag, after your existing scripts

const API_URL = window.location.origin;

// Load all content from the backend
async function loadWebsiteContent() {
  try {
    // Load Hero Content
    const heroContent = await fetch(`${API_URL}/api/content/hero`).then(r => r.json());
    if (heroContent.headline) {
      const headlineEl = document.getElementById('headline');
      if (headlineEl) headlineEl.textContent = heroContent.headline;
    }
    if (heroContent.subheadline) {
      const subheadlineEl = document.getElementById('subheadline');
      if (subheadlineEl) subheadlineEl.textContent = heroContent.subheadline;
    }

    // Load Services Content
    const servicesContent = await fetch(`${API_URL}/api/content/services`).then(r => r.json());
    if (servicesContent.marketingTitle) {
      const marketingTitleEl = document.getElementById('marketingTitle');
      if (marketingTitleEl) marketingTitleEl.textContent = servicesContent.marketingTitle;
    }
    if (servicesContent.marketingDescription) {
      const marketingDescEl = document.getElementById('marketingDescription');
      if (marketingDescEl) marketingDescEl.textContent = servicesContent.marketingDescription;
    }
    if (servicesContent.developmentTitle) {
      const developmentTitleEl = document.getElementById('developmentTitle');
      if (developmentTitleEl) developmentTitleEl.textContent = servicesContent.developmentTitle;
    }
    if (servicesContent.developmentDescription) {
      const developmentDescEl = document.getElementById('developmentDescription');
      if (developmentDescEl) developmentDescEl.textContent = servicesContent.developmentDescription;
    }

    // Load Portfolio Projects
    const portfolio = await fetch(`${API_URL}/api/portfolio`).then(r => r.json());
    const portfolioGrid = document.querySelector('[data-portfolio-grid]');
    if (portfolioGrid && portfolio.length > 0) {
      // This requires you to add data-portfolio-grid attribute to your portfolio grid
      // Alternatively, dynamically update existing portfolio cards
      console.log('Portfolio projects loaded:', portfolio);
    }

    console.log('✅ All content loaded from backend');
  } catch (error) {
    console.error('Error loading content:', error);
    console.log('⚠️ Using default static content');
  }
}

// Handle Contact Form Submission
async function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message')
  };

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Submission failed');

    const result = await response.json();
    alert('Thank you for your message! We\'ll get back to you soon.');
    form.reset();
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form. Please try again.');
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadWebsiteContent);

// Export functions for external use
window.contentLoader = {
  loadContent: loadWebsiteContent,
  handleContactForm: handleContactForm
};

console.log('📡 Content loader initialized');
