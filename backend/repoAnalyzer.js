export const detectTech = (repo, treePaths = []) => {
  const techSet = new Set();
  
  // Add topics with nice formatting
  repo.repositoryTopics?.nodes.forEach(t => {
    const topic = t.topic.name;
    if (topic.toLowerCase() === 'react') techSet.add('React');
    else if (topic.toLowerCase() === 'nodejs') techSet.add('Node.js');
    else if (topic.toLowerCase() === 'python') techSet.add('Python');
    else techSet.add(topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' '));
  });

  // Analyze package.json for JS/TS frameworks & libraries
  if (repo.packageJson?.text) {
    try {
      const pkg = JSON.parse(repo.packageJson.text);
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      const ignore = ['eslint', 'prettier', 'typescript', 'nodemon', 'husky', 'ts-node', 'jest', 'vitest', 'postcss', 'autoprefixer'];
      Object.keys(allDeps).forEach(dep => {
        if (!ignore.some(i => dep.includes(i)) && !dep.startsWith('@types/')) {
          // Beautify common JS deps
          if (dep === 'react') techSet.add('React');
          else if (dep === 'react-dom') return;
          else if (dep === 'next') techSet.add('Next.js');
          else if (dep === 'vite') techSet.add('Vite');
          else if (dep === 'express') techSet.add('Express');
          else if (dep === 'tailwindcss') techSet.add('Tailwind CSS');
          else if (dep.startsWith('@')) techSet.add(dep.split('/')[1]);
          else techSet.add(dep);
        }
      });
    } catch(e) {
      console.error("Failed to parse package.json for", repo.name);
    }
  }
  
  // Analyze requirements.txt for Python frameworks
  if (repo.requirementsTxt?.text) {
    repo.requirementsTxt.text.split('\n').forEach(line => {
      const dep = line.split('==')[0].split('>')[0].split('<')[0].split('~')[0].trim();
      if (dep && !dep.startsWith('#') && !dep.startsWith('-')) {
        if (dep.toLowerCase() === 'fastapi') techSet.add('FastAPI');
        else if (dep.toLowerCase() === 'scikit-learn') techSet.add('Scikit-learn');
        else techSet.add(dep);
      }
    });
  }

  // Scan README for major tools/AI models/services not in package/pip
  const readmeText = (repo.readme?.text || repo.readmeLower?.text || '').toLowerCase();
  const keywords = {
    'n8n': 'n8n',
    'comfyui': 'ComfyUI',
    'gemini': 'Gemini AI',
    'groq': 'Groq',
    'supabase': 'Supabase',
    'postgresql': 'PostgreSQL',
    'twilio': 'Twilio',
    'hugging face': 'Hugging Face',
    'huggingface': 'Hugging Face',
    'openai': 'OpenAI',
    'langchain': 'LangChain',
    'vercel': 'Vercel',
    'airtable': 'Airtable',
    'slack': 'Slack API'
  };
  
  Object.keys(keywords).forEach(key => {
    if (readmeText.includes(key)) {
      techSet.add(keywords[key]);
    }
  });

  // Scan deep repository paths if available (from GitHub Tree)
  if (treePaths && treePaths.length > 0) {
    const pathStr = treePaths.join(' ').toLowerCase();
    if (pathStr.includes('.n8n') || pathStr.includes('n8n')) techSet.add('n8n');
    if (pathStr.includes('comfyui')) techSet.add('ComfyUI');
    if (pathStr.includes('docker-compose')) techSet.add('Docker Compose');
    else if (pathStr.includes('dockerfile')) techSet.add('Docker');
    if (pathStr.includes('pyproject.toml')) techSet.add('Poetry');
  } else {
    // Fallbacks if REST tree failed
    if (repo.pyprojectToml?.text) techSet.add('Poetry/pyproject');
    if (repo.dockerfile?.text) techSet.add('Docker');
    if (repo.dockerCompose?.text) techSet.add('Docker Compose');
    if (repo.pomXml?.text) { techSet.add('Java'); techSet.add('Maven'); }
    if (repo.goMod?.text) techSet.add('Go');
    if (repo.cargoToml?.text) { techSet.add('Rust'); techSet.add('Cargo'); }
  }

  return Array.from(techSet);
};

export const extractDescription = (readmeText) => {
  if (!readmeText) return null;
  // Remove YAML, code blocks, comments
  let clean = readmeText
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .map(line => line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')) // Links
    .map(line => line.replace(/[*_~`]/g, '')) // Formatting
    .map(line => line.replace(/^#+\s*/, '')) // Headings
    .map(line => line.trim());
    
  for (let i = 0; i < clean.length; i++) {
    const line = clean[i];
    if (line.length > 40 && !line.startsWith('<') && !line.startsWith('>') && !line.startsWith('-')) {
      let para = line;
      for (let j = i + 1; j < clean.length; j++) {
        if (clean[j].length === 0 || clean[j].startsWith('-') || clean[j].startsWith('<')) break;
        para += ' ' + clean[j];
      }
      // Only truncate if unreasonably long, let CSS handle wrapping
      if (para.length > 400) {
        const match = para.match(/^.{300,400}[.!?](\s|$)/);
        if (match) return match[0].trim();
        return para.slice(0, 350).trim() + '...';
      }
      return para;
    }
  }
  return null;
};

export const fetchTreePaths = async (username, repoName, token) => {
  try {
    const treeRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/git/trees/HEAD?recursive=1`, {
      headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'Portfolio-App' }
    });
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      return treeData.tree.map(t => t.path);
    }
  } catch (e) {
    console.error("Failed to fetch tree for", repoName);
  }
  return [];
};

export const processRepository = async (repo, token, username) => {
  const treePaths = await fetchTreePaths(username, repo.name, token);

  let description = repo.description;
  if (description) {
    description = description.replace(/[*_~`]/g, '').trim();
  }

  const readmeText = repo.readme?.text || repo.readmeLower?.text || '';
  
  if (!description || description.length < 20) {
    const readmeDesc = extractDescription(readmeText);
    if (readmeDesc) description = readmeDesc;
  }

  const finalTech = detectTech(repo, treePaths);

  return {
    id: repo.id,
    title: repo.name.replace(/[-_]/g, ' '),
    name: repo.name,
    description: description || 'No description available for this project.',
    url: repo.url,
    github: repo.url,
    homepage: repo.homepageUrl || null,
    languages: repo.languages?.nodes.map(n => n.name) || [],
    tech: finalTech,
    topics: repo.repositoryTopics?.nodes.map(t => t.topic.name) || [],
    originalId: repo.id
  };
};
