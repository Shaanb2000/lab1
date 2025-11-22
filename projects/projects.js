import { fetchJSON, renderProjects } from '../global.js';

console.log('projects.js loaded and executing...');

try {
  // Fetch project data
  const projects = await fetchJSON('../lib/projects.json');

  console.log('Projects loaded:', projects.length); // Debug log

  // Select the projects container
  const projectsContainer = document.querySelector('.projects');

  if (!projectsContainer) {
    console.error('Projects container (.projects) not found in DOM');
  } else if (projects && projects.length > 0) {
    // Render the projects
    renderProjects(projects, projectsContainer, 'h2');
  } else {
    console.error('No projects to render. Projects array:', projects);
    projectsContainer.innerHTML = '<p style="color: red; padding: 1em; border: 1px solid red;">⚠️ Error: No projects found. Check the browser console for details.</p>';
  }

  // Update project count (Step 1.6)
  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
    projectsTitle.textContent = projects.length > 0 ? `${projects.length} Projects` : 'Projects';
  }
} catch (error) {
  console.error('Error in projects.js:', error);
  const projectsContainer = document.querySelector('.projects');
  if (projectsContainer) {
    projectsContainer.innerHTML = '<p style="color: red; padding: 1em; border: 1px solid red;">⚠️ Error loading projects. Check console for details.</p>';
  }
}
