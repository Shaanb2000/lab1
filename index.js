import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const allProjects = await fetchJSON('./projects/projects.json');



const latest = allProjects.slice(0, 3);

const homeContainer = document.querySelector('.projects');
renderProjects(latest, homeContainer, 'h3');

const githubData = await fetchGitHubData('shaanb3733'); // your username
const statsEl = document.querySelector('#profile-stats');

if (statsEl) {
    statsEl.innerHTML = `
        <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}
