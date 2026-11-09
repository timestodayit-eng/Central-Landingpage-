import fs from 'fs';
const file=process.argv[2] || './sample-malaysia.json';
const raw=fs.readFileSync(file,'utf8');
const data=JSON.parse(raw);
if(!Array.isArray(data) && !Array.isArray(data?.sections) && !Array.isArray(data?.blocks) && typeof data!=='object') throw new Error('Unsupported JSON root');
console.log('JSON syntax valid:',file);
