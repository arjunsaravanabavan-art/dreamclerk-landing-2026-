import fs from 'fs';
const txt = fs.readFileSync('./audit-out.json', 'utf8').trim();
const lines = txt.split(/\n(?=\{)/);
const json = JSON.parse('[' + lines.join(',') + ']');
console.log(JSON.stringify(json, null, 2));
