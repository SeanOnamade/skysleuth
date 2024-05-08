const fs = require('fs');

// Read JavaScript file
let content = fs.readFileSync('path/to/your/javascript/file.js', 'utf8');

// Replace placeholders with environment variable values
content = content.replace(/%API_KEY%/g, process.env.API_KEY);
content = content.replace(/%MAP_API_KEY%/g, process.env.MAP_API_KEY);

// Write modified content to a build directory
fs.writeFileSync('path/to/your/build/directory/file.js', content);
