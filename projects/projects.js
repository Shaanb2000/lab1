import { fetchJSON, renderProjects } from '../global.js';

// Fetch project data
const projects = await fetchJSON('../lib/projects.json');

console.log('Projects loaded:', projects.length); // Debug log

// Select the projects container
const projectsContainer = document.querySelector('.projects');

if (!projectsContainer) {
  console.error('Projects container (.projects) not found in DOM');
}

// Render the projects
if (projectsContainer) {
  if (projects && projects.length > 0) {
    renderProjects(projects, projectsContainer, 'h2');
  } else {
    console.error('No projects to render. Projects array:', projects);
    projectsContainer.innerHTML = '<p>No projects found.</p>';
  }
}

// Update project count (Step 1.6)
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}
