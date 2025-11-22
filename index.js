import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';  // Import functions

// Fetch project data
const projects = await fetchJSON('./lib/projects.json');

// Filter the first 3 projects
const latestProjects = projects.slice(0, 3);

// Select the container where the projects will be displayed
const projectsContainer = document.querySelector('.projects');

// Render the filtered projects
renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('shaanb2000');

const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos || 0}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists || 0}</dd>
            <dt>Followers:</dt><dd>${githubData.followers || 0}</dd>
            <dt>Following:</dt><dd>${githubData.following || 0}</dd>
          </dl>
      `;
} else if (!profileStats) {
    console.error('Profile stats container (#profile-stats) not found');
} else if (!githubData) {
    console.error('GitHub data not loaded');
}
