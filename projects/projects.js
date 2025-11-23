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

  // Get all years from full dataset to maintain consistent color mapping
  let allRolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year,
  );
  let allYears = allRolledData.map(([year]) => year);
  
  // Set up D3 generators with consistent color mapping based on year order
  let colors = d3.scaleOrdinal(d3.schemeTableau10).domain(allYears);
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
  // Only show selected class if we're showing all years (not filtered to one year)
  let currentSelectedIdx = -1;
  let isFiltered = selectedYear && data.length === 1;
  if (selectedYear && !isFiltered) {
    currentSelectedIdx = data.findIndex(d => d.label === selectedYear);
  }

  // Add paths for pie slices
  arcs.forEach((arc, idx) => {
    const year = data[idx].label;
    const originalColor = colors(year); // Use year to get consistent color
    const pathElement = newSVG
      .append('path')
      .attr('d', arc)
      .attr('fill', originalColor)
      .attr('data-original-color', originalColor)
      .attr('class', (!isFiltered && idx === currentSelectedIdx) ? 'selected' : '')
      .on('click', function(event) {
        const clickedYear = year; // Use the year from the loop closure
        
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
        // Render pie chart with filtered projects (will show only selected year if one is selected)
        renderPieChart(filteredProjects);
      });
  });

  // Add legend items
  arcData.forEach((d, idx) => {
    // Only show selected class if we're showing all years (not filtered to one year)
    const isSelected = !isFiltered && idx === currentSelectedIdx;
    const year = data[idx].label;
    const originalColor = colors(year); // Use year to get consistent color
    legend
      .append('li')
      .attr('class', isSelected ? 'legend-item selected' : 'legend-item')
      .attr('style', `--color:${originalColor}`)
      .attr('data-original-color', originalColor)
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
        // Render pie chart with filtered projects (will show only selected year if one is selected)
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
  // Render pie chart with filtered projects (will show only selected year if one is selected)
  renderPieChart(filteredProjects);
});
