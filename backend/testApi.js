import dotenv from 'dotenv';
dotenv.config();
import { fetchAllRepos } from './githubApi.js';

(async () => {
  const repos = await fetchAllRepos('AdityaDugar11', process.env.GITHUB_TOKEN);
  console.log("Total repos fetched:", repos.length);
  console.log(repos.map(r => r.name));
})();
