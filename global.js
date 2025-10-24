// DSC 106 Lab 3: Introduction to JS
// Global JavaScript functionality for portfolio site

// Helper function for DOM selection
function $$(selector) {
  return document.querySelector(selector);
}

// Console log to verify JS is working
console.log("IT'S ALIVE!");

// Determine base path based on current location
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/contact/') || path.includes('/cv/') || path.includes('/projects/') || path.includes('/resume/')) {
    return '../';
  }
  return '';
}

// Navigation data
const navigationData = [
  { href: 'index.html', text: 'Home' },
  { href: 'projects/index.html', text: 'Projects' },
  { href: 'contact/index.html', text: 'Contact' },
  { href: 'resume/index.html', text: 'Resume' },
  { href: 'https://github.com/shaanb2000', text: 'GitHub', external: true }
];

// Generate navigation HTML
function generateNavigation() {
  const basePath = getBasePath();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  let navHTML = '';
  navigationData.forEach(item => {
    const href = item.external ? item.href : basePath + item.href;
    const isCurrent = !item.external && (currentPage === item.href || 
      (currentPage === '' && item.href === 'index.html') ||
      (currentPage === 'index.html' && item.href === 'index.html'));
    
    const currentClass = isCurrent ? ' class="current"' : '';
    const targetAttr = item.external ? ' target="_blank" rel="noopener"' : '';
    
    navHTML += `<a href="${href}"${currentClass}${targetAttr}>${item.text}</a>`;
  });
  
  return navHTML;
}

// Auto-highlight current page
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    link.classList.remove('current');
    const href = link.getAttribute('href');
    
    // Check if this is the current page
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html') ||
        (currentPage === 'index.html' && href === './index.html') ||
        (currentPage === 'index.html' && href === '/index.html')) {
      link.classList.add('current');
    }
  });
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'auto';
  applyTheme(savedTheme);
  createThemeSelector();
}

function applyTheme(theme) {
  const html = document.documentElement;
  
  // Remove existing theme classes
  html.classList.remove('light-theme', 'dark-theme', 'auto-theme');
  
  if (theme === 'light') {
    html.classList.add('light-theme');
    html.style.colorScheme = 'light';
  } else if (theme === 'dark') {
    html.classList.add('dark-theme');
    html.style.colorScheme = 'dark';
  } else {
    html.classList.add('auto-theme');
    html.style.colorScheme = 'light dark';
  }
  
  localStorage.setItem('theme', theme);
}

function createThemeSelector() {
  const currentTheme = localStorage.getItem('theme') || 'auto';
  
  const themeSelector = document.createElement('div');
  themeSelector.className = 'color-scheme';
  themeSelector.innerHTML = `
    <label for="theme-select">Theme:</label>
    <select id="theme-select">
      <option value="auto" ${currentTheme === 'auto' ? 'selected' : ''}>Auto</option>
      <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>Light</option>
      <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>Dark</option>
    </select>
  `;
  
  // Position in top-right corner
  themeSelector.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 0.875rem;
    z-index: 1000;
  `;
  
  document.body.appendChild(themeSelector);
  
  // Add event listener
  const select = themeSelector.querySelector('#theme-select');
  select.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
}

// Contact form encoder
function encodeContactForm() {
  const form = $$('form[action*="mailto"]');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = form.querySelector('input[name="email"]').value;
    const subject = form.querySelector('input[name="subject"]').value;
    const body = form.querySelector('textarea[name="body"]').value;
    
    // Encode the mailto URL
    const mailtoUrl = `mailto:shaanb2000@ucsd.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open mail client
    window.location.href = mailtoUrl;
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Generate navigation if nav element exists
  const nav = $$('nav');
  if (nav) {
    nav.innerHTML = generateNavigation();
  }
  
  // Highlight current page
  highlightCurrentPage();
  
  // Initialize theme system
  initTheme();
  
  // Setup contact form encoder
  encodeContactForm();
});

// Export functions for potential external use
window.portfolioJS = {
  $$,
  getBasePath,
  generateNavigation,
  highlightCurrentPage,
  applyTheme,
  initTheme
};
