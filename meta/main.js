import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Step 1.1: Reading the CSV file in D3
async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

// Step 1.2: Computing commit data
function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/shaanb2000/lab1/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: true,
        writable: false,
        enumerable: false,
      });

      return ret;
    });
}

// Step 1.3: Displaying the stats
function renderCommitInfo(data, commits) {
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Total LOC
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // Total commits
  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  // Number of files
  const numFiles = d3.group(data, (d) => d.file).size;
  dl.append('dt').text('Number of files');
  dl.append('dd').text(numFiles);

  // Average line length
  const avgLineLength = d3.mean(data, (d) => d.length);
  dl.append('dt').text('Average line length');
  dl.append('dd').text(Math.round(avgLineLength) + ' characters');

  // Maximum depth
  const maxDepth = d3.max(data, (d) => d.depth);
  dl.append('dt').text('Maximum depth');
  dl.append('dd').text(maxDepth);

  // Average depth
  const avgDepth = d3.mean(data, (d) => d.depth);
  dl.append('dt').text('Average depth');
  dl.append('dd').text(Math.round(avgDepth * 10) / 10);

  // Average file length
  const fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (v) => v.line),
    (d) => d.file,
  );
  const averageFileLength = d3.mean(fileLengths, (d) => d[1]);
  dl.append('dt').text('Average file length');
  dl.append('dd').text(Math.round(averageFileLength) + ' lines');

  // Longest file
  const longestFile = d3.greatest(fileLengths, (d) => d[1]);
  dl.append('dt').text('Longest file');
  dl.append('dd').text(longestFile ? longestFile[0] : 'N/A');

  // Time of day most work is done
  const workByPeriod = d3.rollups(
    data,
    (v) => v.length,
    (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' }),
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  dl.append('dt').text('Time of day most work is done');
  dl.append('dd').text(maxPeriod || 'N/A');
}

// Step 3: Tooltip functions
function renderTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (!commit || Object.keys(commit).length === 0) return;

  link.href = commit.url;
  link.textContent = commit.id.substring(0, 7);
  date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'full',
  });
  time.textContent = commit.time || '';
  author.textContent = commit.author || '';
  lines.textContent = commit.totalLines || 0;
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX + 10}px`;
  tooltip.style.top = `${event.clientY + 10}px`;
}

// Step 2 & 4 & 5: Scatterplot with brushing
let xScale, yScale, rScale; // Make scales accessible for brushing

function renderScatterPlot(data, commits) {
  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  // Create scales
  xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();

  yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);

  // Add gridlines
  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);

  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  // Create axes
  const xAxis = d3.axisBottom(xScale);
  
  // Generate tick values for every 2 hours (0, 2, 4, 6, ..., 22)
  const yTickValues = d3.range(0, 25, 2); // [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
  
  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(yTickValues)
    .tickFormat((d) => {
      const hour = Math.floor(Number(d)) % 24;
      return String(hour).padStart(2, '0') + ':00';
    });

  // Add X axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  // Add Y axis
  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  // Create radius scale
  const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
  rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

  // Sort commits by size (largest first)
  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

  // Draw dots
  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(d.totalLines))
    .attr('fill', (d) => {
      // Color based on time of day
      const hour = d.hourFrac;
      if (hour >= 6 && hour < 12) {
        return 'oklch(70% 20% 60)'; // Morning - orange
      } else if (hour >= 12 && hour < 18) {
        return 'oklch(75% 25% 100)'; // Afternoon - yellow
      } else if (hour >= 18 && hour < 22) {
        return 'oklch(60% 15% 200)'; // Evening - blue
      } else {
        return 'oklch(50% 10% 250)'; // Night - darker blue
      }
    })
    .style('fill-opacity', 0.7)
    .on('mouseenter', (event, commit) => {
      d3.select(event.currentTarget).style('fill-opacity', 1);
      renderTooltipContent(commit);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mouseleave', (event) => {
      d3.select(event.currentTarget).style('fill-opacity', 0.7);
      updateTooltipVisibility(false);
    });

  // Step 5: Brushing
  function isCommitSelected(selection, commit) {
    if (!selection) {
      return false;
    }
    const [[x0, y0], [x1, y1]] = selection;
    const commitX = xScale(commit.datetime);
    const commitY = yScale(commit.hourFrac);
    
    // Ensure x0 < x1 and y0 < y1 (brush can be drawn in any direction)
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    
    // Check if commit is within the selection bounds
    return commitX >= minX && commitX <= maxX && commitY >= minY && commitY <= maxY;
  }

  function renderSelectionCount(selection) {
    const selectedCommits = selection
      ? commits.filter((d) => isCommitSelected(selection, d))
      : [];

    const countElement = document.querySelector('#selection-count');
    if (countElement) {
      countElement.textContent = selectedCommits.length > 0 
        ? `${selectedCommits.length} commits selected`
        : 'No commits selected';
    }

    return selectedCommits;
  }

  function renderLanguageBreakdown(selection) {
    const selectedCommits = selection
      ? commits.filter((d) => isCommitSelected(selection, d))
      : [];
    const container = document.getElementById('language-breakdown');

    if (selectedCommits.length === 0) {
      container.innerHTML = '';
      return;
    }

    const lines = selectedCommits.flatMap((d) => d.lines);

    const breakdown = d3.rollup(
      lines,
      (v) => v.length,
      (d) => d.type,
    );

    container.innerHTML = '';

    for (const [language, count] of breakdown) {
      const proportion = count / lines.length;
      const formatted = d3.format('.1~%')(proportion);

      container.innerHTML += `
        <dt>${language}</dt>
        <dd>${count} lines (${formatted})</dd>
      `;
    }
  }

  function brushed(event) {
    const selection = event.selection;
    
    if (selection) {
      // Use the dots selection to update circles in this specific chart
      dots.selectAll('circle').classed('selected', (d) =>
        isCommitSelected(selection, d),
      );
      renderSelectionCount(selection);
      renderLanguageBreakdown(selection);
    } else {
      // Clear selection when brush is cleared
      dots.selectAll('circle').classed('selected', false);
      renderSelectionCount(null);
      renderLanguageBreakdown(null);
    }
  }

  // Create brush with extent
  const brush = d3
    .brush()
    .extent([
      [usableArea.left, usableArea.top],
      [usableArea.right, usableArea.bottom],
    ])
    .on('start brush end', brushed);

  svg.call(brush);

  // Raise dots above the brush overlay so tooltips work, but brush still functions
  // The brush overlay will still capture brush events even if dots are above
  dots.raise();
}

// Main execution
let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);
renderScatterPlot(data, commits);

