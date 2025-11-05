import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// fetch first 3 projects
const all = await fetchJSON('./lib/projects.json');
const latest = all.slice(0, 3);
const container = document.querySelector('.projects');
renderProjects(latest, container, 'h3');

// fetch GitHub stats
const githubData = await fetchGitHubData('shaanb2000');
const stats = document.querySelector('#profile-stats');
if (stats && githubData) {
  stats.innerHTML = `
    <h2>GitHub Profile</h2>
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
      <dt>Gists:</dt><dd>${githubData.public_gists}</dd>
    </dl>
  `;
}

