import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Fetch project data
const projects = await fetchJSON('../lib/projects.json');

// Select the projects container
const projectsContainer = document.querySelector('.projects');

// Render the projects
if (projectsContainer && projects.length > 0) {
  renderProjects(projects, projectsContainer, 'h2');
}

// Update project count
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `${projects.length} Projects`;
}

// Initialize search and pie chart
let query = '';
let selectedIndex = -1;
let selectedYear = null; // Store selected year to preserve across re-renders

// Function to filter projects based on query and selected year
function filterProjects() {
  let filteredProjects = projects;

  // Apply search filter if query exists
  if (query) {
    filteredProjects = filteredProjects.filter(project => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    });
  }

  // Apply year filter if a year is selected
  if (selectedYear) {
    filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
  }

  return filteredProjects;
}

// Function to render pie chart
function renderPieChart(projectsGiven) {
  // Calculate rolled data (projects per year)
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // Convert to data format for pie chart
  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  // Set up D3 generators
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  // Clear existing paths and legend
  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // Determine which slice should be highlighted based on selectedYear
  let currentSelectedIdx = -1;
  if (selectedYear) {
    currentSelectedIdx = data.findIndex(d => d.label === selectedYear);
  }

  // Add paths for pie slices
  arcs.forEach((arc, idx) => {
    newSVG
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', idx === currentSelectedIdx ? 'selected' : '')
      .on('click', function(event, d) {
        const clickedYear = data[arcData.indexOf(d)].label;
        
        // Toggle selection
        if (selectedYear === clickedYear) {
          selectedYear = null;
          selectedIndex = -1;
        } else {
          selectedYear = clickedYear;
          // Find index in all projects data
          let allRolledData = d3.rollups(
            projects,
            (v) => v.length,
            (d) => d.year,
          );
          let allData = allRolledData.map(([year, count]) => ({
            value: count,
            label: year
          }));
          selectedIndex = allData.findIndex(d => d.label === clickedYear);
        }

        // Filter and render projects
        let filteredProjects = filterProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects);
      });
  });

  // Add legend items
  arcData.forEach((d, idx) => {
    const isSelected = idx === currentSelectedIdx;
    legend
      .append('li')
      .attr('class', isSelected ? 'legend-item selected' : 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${data[idx].label} <em>(${data[idx].value})</em>`)
      .on('click', function() {
        const clickedYear = data[idx].label;
        
        // Toggle selection
        if (selectedYear === clickedYear) {
          selectedYear = null;
          selectedIndex = -1;
        } else {
          selectedYear = clickedYear;
          // Find index in all projects data
          let allRolledData = d3.rollups(
            projects,
            (v) => v.length,
            (d) => d.year,
          );
          let allData = allRolledData.map(([year, count]) => ({
            value: count,
            label: year
          }));
          selectedIndex = allData.findIndex(d => d.label === clickedYear);
        }

        // Filter and render projects
        let filteredProjects = filterProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects);
      });
  });
}

// Initial render of pie chart
renderPieChart(projects);

// Search functionality
const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  
  // Filter projects using the combined filter function
  let filteredProjects = filterProjects();

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
