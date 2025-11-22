import { fetchJSON, renderProjects } from '../global.js';

// load JSON from SAME folder
const projects = await fetchJSON('./projects.json');

const container = document.querySelector('.projects');
renderProjects(projects, container, 'h2');

const titleEl = document.querySelector('.projects-title');
if (titleEl) {
  titleEl.textContent = `${projects.length} Projects`;
}
