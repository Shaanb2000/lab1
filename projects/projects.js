import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// Update projects title with count
const title = document.querySelector('.projects-title');
if (title) title.textContent = `${projects.length} Projects`;

