import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';  // Import functions

console.log('index.js loaded and executing...');

try {
  // Fetch project data
  const projects = await fetchJSON('./lib/projects.json');

  // Filter the first 3 projects
  const latestProjects = projects.slice(0, 3);

  // Select the container where the projects will be displayed
  const projectsContainer = document.querySelector('.projects');

  // Render the filtered projects
  if (projectsContainer) {
    if (latestProjects && latestProjects.length > 0) {
      renderProjects(latestProjects, projectsContainer, 'h2');
    } else {
      projectsContainer.innerHTML = '<p style="color: red; padding: 1em; border: 1px solid red;">⚠️ Error: No projects found. Check console for details.</p>';
    }
  }

  // Fetch GitHub data
  const githubData = await fetchGitHubData('shaanb2000');

  const profileStats = document.querySelector('#profile-stats');

  if (profileStats && githubData && Object.keys(githubData).length > 0) {
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
  } else if (!githubData || Object.keys(githubData).length === 0) {
    console.error('GitHub data not loaded. Check console for fetch errors.');
    if (profileStats) {
      profileStats.innerHTML = '<p style="color: red; padding: 1em; border: 1px solid red;">⚠️ Error loading GitHub stats. Check console for details.</p>';
    }
  }
} catch (error) {
  console.error('Error in index.js:', error);
  // Show error on page
  const projectsContainer = document.querySelector('.projects');
  if (projectsContainer) {
    projectsContainer.innerHTML = '<p style="color: red; padding: 1em; border: 1px solid red;">⚠️ Error loading projects. Check console for details.</p>';
  }
  const profileStats = document.querySelector('#profile-stats');
  if (profileStats) {
    profileStats.innerHTML = '<p style="color: red; padding: 1em; border: 1px solid red;">⚠️ Error loading GitHub stats. Check console for details.</p>';
  }
}
