import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Load projects and display latest 3
const allProjects = await fetchJSON('./lib/projects.json');
const latest = allProjects.slice(0, 3);
const container = document.querySelector('.projects');
renderProjects(latest, container, 'h3');

// Fetch and display GitHub stats
const githubData = await fetchGitHubData('shaanb2000');
const profileStats = document.querySelector('#profile-stats');
if (profileStats && githubData) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}

