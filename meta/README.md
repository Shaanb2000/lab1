# Meta Analysis Page - Setup Instructions

## Prerequisites

You need to install Node.js to generate the `loc.csv` file. Download it from [nodejs.org](https://nodejs.org/).

## Setup Steps

1. **Install elocuent package:**
   ```bash
   npm install elocuent -D
   ```

2. **Generate the CSV file:**
   ```bash
   npx elocuent -d . -o meta/loc.csv --spaces 2
   ```
   (Adjust `--spaces 2` if you use a different indentation)

3. **Re-run the command** whenever you make new commits to update the data.

## Note

The `loc.csv` file should be committed to your repository (it's not in `.gitignore`).

