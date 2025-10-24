// DSC 106 Lab 3: Introduction to JS
// Global JavaScript functionality for portfolio site

// Helper function for DOM selection
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
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

// Navigation data - array of objects
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/shaanb2000', title: 'GitHub' }
];

// Create navigation menu
function createNavigation() {
  // Create nav element and add it to body
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  // Loop through pages and create links
  for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    // Create link element
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    
    // Add current class if this is the current page
    a.classList.toggle(
      'current',
      a.host === location.host && a.pathname === location.pathname
    );
    
    // Add target="_blank" for external links
    a.toggleAttribute('target', '_blank', a.host !== location.host);
    
    // Add to nav
    nav.append(a);
  }
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'automatic';
  applyTheme(savedTheme);
  createThemeSelector();
}

function applyTheme(theme) {
  const html = document.documentElement;
  
  if (theme === 'light') {
    html.style.colorScheme = 'light';
  } else if (theme === 'dark') {
    html.style.colorScheme = 'dark';
  } else {
    html.style.colorScheme = 'light dark';
  }
  
  localStorage.setItem('theme', theme);
}

function createThemeSelector() {
  const currentTheme = localStorage.getItem('theme') || 'automatic';
  
  // Add theme switcher HTML
  document.body.insertAdjacentHTML('afterbegin', `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="automatic" ${currentTheme === 'automatic' ? 'selected' : ''}>Automatic</option>
        <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>Light</option>
        <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>Dark</option>
      </select>
    </label>
  `);
  
  // Add event listener
  const select = document.querySelector('.color-scheme select');
  select.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
}

// Contact form encoder
function encodeContactForm() {
  const form = $$('form[action*="mailto"]')[0];
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
  // Create navigation menu
  createNavigation();
  
  // Initialize theme system
  initTheme();
  
  // Setup contact form encoder
  encodeContactForm();
});

// Export functions for potential external use
window.portfolioJS = {
  $$,
  getBasePath,
  createNavigation,
  applyTheme,
  initTheme
};
