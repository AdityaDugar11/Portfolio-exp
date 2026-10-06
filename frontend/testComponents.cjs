const fs = require('fs');
const repos = JSON.parse(fs.readFileSync('../repos.json', 'utf8'));

const nodes = repos.map((repo, index) => ({
  ...repo,
  graphId: `repo-${index}`,
  repoIndex: index,
}));

const links = [];

// Calculate similarity matrix
const getScore = (a, b) => {
  const sharedLangs = (a.languages || []).filter(l => (b.languages || []).includes(l)).length;
  const sharedTopics = (a.topics || []).filter(t => (b.topics || []).includes(t)).length;
  const sharedTech = (a.tech || []).filter(t => (b.tech || []).includes(t)).length;
  return (sharedLangs * 2) + (sharedTopics * 3) + (sharedTech * 4);
};

// 1. Normal links
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const score = getScore(nodes[i], nodes[j]);
    if (score > 0) {
      links.push({
        source: nodes[i].graphId,
        target: nodes[j].graphId,
        value: score,
      });
    }
  }
}

// 2. Determine connected components
class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
  }
  find(i) {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }
  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
      return true;
    }
    return false;
  }
}

const getComponents = () => {
  const uf = new UnionFind(nodes.length);
  const idToIndex = new Map(nodes.map((n, i) => [n.graphId, i]));
  
  links.forEach(link => {
    uf.union(idToIndex.get(link.source), idToIndex.get(link.target));
  });
  
  const components = new Map();
  for (let i = 0; i < nodes.length; i++) {
    const root = uf.find(i);
    if (!components.has(root)) components.set(root, []);
    components.get(root).push(nodes[i]);
  }
  return Array.from(components.values());
};

let components = getComponents();

// 3. Connect components until 1 remains
while (components.length > 1) {
  let bestEdge = null;
  let bestScore = -1;
  let bestTotalMeta = -1;
  
  // Try to connect component 0 to any other component
  const compA = components[0];
  let compBIndex = 1;
  let targetCompB = components[1];
  
  for (let c = 1; c < components.length; c++) {
    const compB = components[c];
    
    for (const nodeA of compA) {
      for (const nodeB of compB) {
        const score = getScore(nodeA, nodeB);
        const totalMeta = (nodeA.languages || []).length + (nodeA.topics || []).length + (nodeA.tech || []).length + 
                          (nodeB.languages || []).length + (nodeB.topics || []).length + (nodeB.tech || []).length;
                          
        if (score > bestScore || (score === bestScore && totalMeta > bestTotalMeta)) {
          bestScore = score;
          bestTotalMeta = totalMeta;
          bestEdge = { source: nodeA.graphId, target: nodeB.graphId, value: score > 0 ? score : 0.25, fallback: true };
          targetCompB = compB;
          compBIndex = c;
        }
      }
    }
  }
  
  if (bestEdge) {
    links.push(bestEdge);
  }
  
  // Recompute components
  components = getComponents();
}

const finalComponents = getComponents();

const connectedNodeIds = new Set();
links.forEach(link => {
  connectedNodeIds.add(String(link.source));
  connectedNodeIds.add(String(link.target));
});

console.log('TOTAL NODES:', nodes.length);
console.log('TOTAL LINKS:', links.length);
console.log('CONNECTED COMPONENTS:', finalComponents.length);
console.log('ISOLATED NODES:', nodes.filter(n => !connectedNodeIds.has(String(n.graphId))).map(n => n.name));

