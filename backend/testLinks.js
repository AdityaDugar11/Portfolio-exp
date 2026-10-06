import fs from 'fs';

const data = JSON.parse(fs.readFileSync('repos.json', 'utf8'));

let links = 0;
for (let i = 0; i < data.length; i++) {
  for (let j = i + 1; j < data.length; j++) {
    const n1 = data[i];
    const n2 = data[j];
    
    let score = 0;
    const sharedLangs = (n1.languages || []).filter(l => (n2.languages || []).includes(l)).length;
    const sharedTopics = (n1.topics || []).filter(t => (n2.topics || []).includes(t)).length;
    const sharedTech = (n1.tech || []).filter(t => (n2.tech || []).includes(t)).length;
    
    score = (sharedLangs * 2) + (sharedTopics * 3) + (sharedTech * 4);
    
    if (score > 0) {
      links++;
    }
  }
}
console.log("Total links:", links);
