const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'app.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const regex = /limit: 100,/g;
content = content.replace(regex, 'limit: 1000,');

fs.writeFileSync(targetPath, content);
console.log('Limit increased');
