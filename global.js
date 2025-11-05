// DSC 106 Lab 3: Introduction to JS
// Global JavaScript functionality for portfolio site

// Helper function for DOM selection
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Helper function for single element selection (for tutorial compatibility)
function $(selector, context = document) {
  return context.querySelector(selector);
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
  
  // Add theme class to html element
  document.documentElement.className = '';
  if (value === 'light') {
    document.documentElement.classList.add('light-theme');
  } else if (value === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.add('auto-theme');
  }
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

// Fetch JSON utility
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching or parsing JSON:", err);
    return [];
  }
}

// Render projects dynamically
export function renderProjects(projects, container, headingLevel = 'h2') {
  if (!container) return;
  container.innerHTML = ''; // clear old content
  for (const project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
      <p><strong>Year:</strong> ${project.year ?? 'N/A'}</p>
    `;
    container.appendChild(article);
  }
}

// Fetch GitHub profile data
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

// Export functions for potential external use
window.portfolioJS = {
  $$,
  getBasePath,
  createNavigation,
  applyTheme,
  initTheme
};
