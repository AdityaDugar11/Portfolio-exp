import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchAllRepos } from './githubApi.js';
import { processRepository } from './repoAnalyzer.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.get('/api/repositories', async (req, res) => {
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN is not configured.' });
  }
  
  try {
    const repos = await fetchAllRepos('AdityaDugar11', GITHUB_TOKEN);
    res.json(repos);
  } catch (error) {
    console.error('Error fetching repositories API:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

app.get('/api/projects', async (req, res) => {
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN is not configured.' });
  }

  const query = `
    query {
      user(login: "AdityaDugar11") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              id
              name
              description
              url
              homepageUrl
              languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                nodes {
                  name
                }
              }
              repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
              readme: object(expression: "HEAD:README.md") {
                ... on Blob { text }
              }
              readmeLower: object(expression: "HEAD:readme.md") {
                ... on Blob { text }
              }
              packageJson: object(expression: "HEAD:package.json") {
                ... on Blob { text }
              }
              requirementsTxt: object(expression: "HEAD:requirements.txt") {
                ... on Blob { text }
              }
              pyprojectToml: object(expression: "HEAD:pyproject.toml") {
                ... on Blob { text }
              }
              dockerfile: object(expression: "HEAD:Dockerfile") {
                ... on Blob { text }
              }
              dockerCompose: object(expression: "HEAD:docker-compose.yml") {
                ... on Blob { text }
              }
              pomXml: object(expression: "HEAD:pom.xml") {
                ... on Blob { text }
              }
              goMod: object(expression: "HEAD:go.mod") {
                ... on Blob { text }
              }
              cargoToml: object(expression: "HEAD:Cargo.toml") {
                ... on Blob { text }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    // Fetch repository trees dynamically to scan nested files
    const pinnedRepos = await Promise.all(data.data.user.pinnedItems.nodes.map(async (repo, index) => {
      const enriched = await processRepository(repo, GITHUB_TOKEN, 'AdityaDugar11');
      
      const getVisualType = (repo, techArray, desc) => {
        const titleStr = repo.name.toLowerCase();
        const descStr = (desc || '').toLowerCase();
        const techStr = techArray.join(' ').toLowerCase();
        const topicStr = (repo.repositoryTopics?.nodes.map(t => t.topic.name) || []).join(' ').toLowerCase();
        const readmeStr = (repo.readme?.text || repo.readmeLower?.text || '').toLowerCase();
        
        const count = (str, words, weight = 1) => {
          let score = 0;
          words.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`);
            if (regex.test(str)) score += weight;
            else if (str.includes(word) && word.length > 5) score += (weight * 0.5); // Partial match fallback for compounds
          });
          return score;
        };
        
        const types = {
          'scheme-matching': 0,
          'rag-support': 0,
          'lead-qualification': 0,
          'content-generation': 0,
          'computer-vision': 0,
          'fintech-risk': 0
        };

        const scoreAll = (str, weight) => {
            if (!str) return;
            types['scheme-matching'] += count(str, ['scheme', 'schemes', 'marginalized', 'entrepreneur', 'entrepreneurs', 'eligibility', 'government', 'matching'], weight);
            types['rag-support'] += count(str, ['rag', 'faq', 'support', 'retrieval', 'knowledge', 'escalate', 'escalates', 'customer support'], weight);
            types['lead-qualification'] += count(str, ['lead', 'leads', 'qualification', 'capture', 'intent', 'scoring', 'scores', 'urgency', 'budget'], weight);
            types['content-generation'] += count(str, ['content', 'generation', 'generating', 'instagram', 'youtube', 'social', 'copy', 'comfyui', 'ollama', 'publishing'], weight);
            types['computer-vision'] += count(str, ['disease', 'crop', 'farmers', 'vision', 'image', 'detection', 'agrivision'], weight);
            types['fintech-risk'] += count(str, ['fraud', 'payment', 'fintech', 'transaction', 'risk', 'guardian', 'orchestration'], weight);
        };

        scoreAll(titleStr, 5);
        scoreAll(descStr, 4);
        scoreAll(topicStr, 4);
        scoreAll(techStr, 3);
        scoreAll(readmeStr, 1);

        let bestType = 'generic-ai';
        let maxScore = 0;
        
        Object.entries(types).forEach(([type, score]) => {
          if (score > maxScore) {
            maxScore = score;
            bestType = type;
          }
        });

        return maxScore >= 3 ? bestType : 'generic-ai';
      };

      return {
        ...enriched,
        id: index + 1, // Override id for pinned frontend logic
        visualType: getVisualType(repo, enriched.tech, enriched.description),
        category: 'GITHUB PROJECT'
      };
    }));

    res.json(pinnedRepos);
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    res.status(500).json({ error: 'Failed to fetch projects from GitHub' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
