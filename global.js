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
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'resume/index.html', title: 'Resume' },
  { url: 'https://github.com/shaanb2000', title: 'GitHub' }
];

// Create navigation menu
function createNavigation() {
  // Create nav element and add it to body
  let nav = document.createElement('nav');
  document.body.prepend(nav);
  
  // Get base path for current page
  const basePath = getBasePath();
  
  // Loop through pages and create links
  for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    // Add base path for internal links
    if (!url.startsWith('http')) {
      url = basePath + url;
    }
    
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

// ---- THEME SWITCHER ----
document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const schemeSelect = document.querySelector(".color-scheme select");

function setColorScheme(value) {
  document.documentElement.style.setProperty("color-scheme", value);
  localStorage.colorScheme = value;
  schemeSelect.value = value;
}

// Change handler
schemeSelect.addEventListener("change", (e) => {
  setColorScheme(e.target.value);
});

// On load: apply saved or default
if (localStorage.colorScheme) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme("light dark"); // Automatic by default
}

// Contact form encoder
function encodeContactForm() {
  const form = $$('form')[0];
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = form.querySelector('input[name="email"]').value;
    const subject = form.querySelector('input[name="subject"]').value;
    const body = form.querySelector('textarea[name="body"]').value;
    
    // Encode the mailto URL with proper parameters
    const mailtoUrl = `mailto:shaanb2000@ucsd.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open mail client
    window.location.href = mailtoUrl;
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create navigation menu
  createNavigation();
  
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
