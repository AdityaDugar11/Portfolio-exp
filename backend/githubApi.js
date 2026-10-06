import { processRepository } from './repoAnalyzer.js';

export const fetchAllRepos = async (username, token) => {
  let allRepos = [];
  let hasNextPage = true;
  let cursor = null;
  let pinnedRepoIds = new Set();
  
  try {
    const pinnedResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query {
            user(login: "${username}") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    id
                  }
                }
              }
            }
          }
        `
      })
    });
    const pinnedData = await pinnedResponse.json();
    pinnedData.data.user.pinnedItems.nodes.forEach(repo => pinnedRepoIds.add(repo.id));
  } catch (error) {
    console.error("Error fetching pinned repos for exclusion", error);
  }

  while (hasNextPage) {
    const query = `
      query($cursor: String) {
        user(login: "${username}") {
          repositories(first: 50, after: $cursor, ownerAffiliations: OWNER, privacy: PUBLIC) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              name
              description
              url
              homepageUrl
              isArchived
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
    `;

    try {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables: { cursor } })
      });
      const data = await response.json();
      
      const repos = data.data.user.repositories.nodes;
      
      const processedBatch = await Promise.all(repos.map(async repo => {
        return await processRepository(repo, token, username);
      }));
      
      for (const pRepo of processedBatch) {
        if (pRepo) {
          allRepos.push(pRepo);
        }
      }
      
      hasNextPage = data.data.user.repositories.pageInfo.hasNextPage;
      cursor = data.data.user.repositories.pageInfo.endCursor;
    } catch (error) {
      console.error("Error fetching all repos", error);
      break;
    }
  }

  return allRepos;
};
