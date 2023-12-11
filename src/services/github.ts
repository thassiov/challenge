import { z } from 'zod';
import { HttpRequestError, ServiceError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { makeGetRequest } from '../utils/fetch';
import { AxiosResponseHeaders } from 'axios';

export class GithubService implements IGithubService {
  private readonly ghAPI: IGithubAPI;
  constructor() {
    this.ghAPI = new GithubAPI();
  }

  async getUserRepository(username: GithubUsername, accessToken?: string): Promise<UserRepository[]> {
    if (!githubUsernameSchema.safeParse(username).success) {
      logger.error('Username provided is not valid', { data: username });
      throw new ValidationError('Username provided is not valid', { data: username });
    }

    try {
      const repos = await this.ghAPI.getUserRepository(username, accessToken) as RepositoryRecord[];

      if (!repos.length) {
        return [];
      }

      const promisedRepoInfo = repos.map(async (repo) => {
        const branches = await this.getRepositoryBranches(username, repo.name as string, accessToken);
        return {
          branches,
          repositoryName: repo.name as string,
          owner: (repo.owner as { login: string }).login,
        };
      });

      const userRepositories = await Promise.all(promisedRepoInfo);

      return userRepositories;
    } catch (err) {
      logger.error(`Could not get user repos: ${(err as Error).message }`, { data: username });
      throw new ServiceError('Could not get user repos', { data: username }, err as Error);
    }
  }

  private async getRepositoryBranches(username: GithubUsername, repo: GithubRepositoryName, accessToken = ''): Promise<RepositoryBranch[]> {
    const result = await this.ghAPI.getRepositoryBranches(username, repo, accessToken);

    if (!result.length) {
      return [];
    }

    const branches = result.map((branch: BranchRecord) => ({ name: branch.name as string, lastCommitSha: (branch.commit as { sha: string }).sha }));

    return branches;
  }
}

export class GithubAPI implements IGithubAPI {
  private readonly BASE_URL = 'https://api.github.com';
  private readonly DEFAULT_HEADERS = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  async getUserRepository(username: GithubUsername, accessToken = '', reposPerPage = 30): Promise<RepositoryRecord[]> {
    if (!githubUsernameSchema.safeParse(username).success) {
      logger.error('Username provided is not valid', { data: username });
      throw new ValidationError('Username provided is not valid', { data: username });
    }

    try {
      const url = `${this.BASE_URL}/users/${username}/repos?per_page=${reposPerPage}&type=owner`;

      const auth = accessToken ? { 'Authorization': `${accessToken}` } : {};
      const headersToSend = {
        ...this.DEFAULT_HEADERS,
        ...auth,
      };

      const { data, headers } = await makeGetRequest(url, { headers: headersToSend });

      const pages = this.returnPaginationCounter(headers as AxiosResponseHeaders);

      if (pages) {
        for (let index = 2; index < pages; index++) {
          const { data: newPageData } = await makeGetRequest(`${url}&page=${index}`, { headers: headersToSend });
          Array.prototype.push.apply(data, newPageData);
        }
      }

      return data as RepositoryRecord[];
    } catch (error) {
      logger.error('Could not retrieve the user repos', { data: username });
      throw new HttpRequestError('Could not retrieve the user repos', { data: username }, error as Error);
    }
  }

  async getRepositoryBranches(username: GithubUsername, repoName: GithubRepositoryName, accessToken = '', branchesPerPage = 30): Promise<BranchRecord[]> {
    if (!githubUsernameSchema.safeParse(username).success) {
      logger.error('Username provided is not valid', { data: username });
      throw new ValidationError('Username provided is not valid', { data: username });
    }

    if (!githubRepositoryNameSchema.safeParse(repoName).success) {
      logger.error('Repository provided is not valid', { data: repoName });
      throw new ValidationError('Repository provided is not valid', { data: repoName });
    }

    try {
      const url = `${this.BASE_URL}/repos/${username}/${repoName}/branches?per_page=${branchesPerPage}`;
      const auth = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
      const headersToSend = {
        ...this.DEFAULT_HEADERS,
        ...auth,
      };

      const { data, headers } = await makeGetRequest(url, { headers: headersToSend });

      const pages = this.returnPaginationCounter(headers as AxiosResponseHeaders);

      if (pages) {
        for (let index = 2; index < pages; index++) {
          const { data: newPageData } = await makeGetRequest(`${url}&page=${index}`, { headers: headersToSend });
          Array.prototype.push.apply(data, newPageData);
        }
      }

      return data as BranchRecord[];
    } catch (error) {
      logger.error('Could not retrieve the repos branches', { data: { username, repoName } });
      throw new HttpRequestError('Could not retrieve the repos branches', { data: JSON.stringify({ username, repoName }) }, error as Error);
    }
  }

  private returnPaginationCounter(headers: AxiosResponseHeaders): number {
    const lastToken = '>; rel="last"';

    if (!headers?.link || !headers?.link.includes(lastToken)) {
      return 0;
    }

    const count = headers.link
    .split(',')
    .filter((part: string) => part.includes(lastToken))[0]
    .slice(1, lastToken.length * -1)
    .split('=')
    .pop();

    return parseInt(count);
  }
}

const githubUsernameSchema = z.string().min(1);
const githubRepositoryNameSchema = z.string().min(1);
const repositoryRecordSchema = z.record(z.string(), z.union([z.string(), z.object({}), z.null(), z.number()]));
const branchRecordSchema = z.record(z.string(), z.union([z.string(), z.object({}), z.null(), z.number()]));

const userRepoBranchSchema = z.object({
  name: z.string(),
  lastCommitSha: z.string(),
});

const userRepoSchema = z.object({
  owner: z.string(),
  repositoryName: z.string(),
  branches: z.array(userRepoBranchSchema),
});

export type RepositoryRecord = z.infer<typeof repositoryRecordSchema>;
export type BranchRecord = z.infer<typeof branchRecordSchema>;
export type UserRepository = z.infer<typeof userRepoSchema>;
export type RepositoryBranch = z.infer<typeof userRepoBranchSchema>;
type IGithubService = {
  getUserRepository: (username: GithubUsername, accessToken?: string) => Promise<UserRepository[]>;
};
type IGithubAPI = {
  getUserRepository: (username: GithubUsername, accessToken?: string, reposPerPage?: number) => Promise<RepositoryRecord[]>;
  getRepositoryBranches: (username: GithubUsername, repoName: GithubRepositoryName, accessToken?: string, branchesPerPage?: number) => Promise<BranchRecord[]>;
};
type GithubUsername = z.infer<typeof githubUsernameSchema>;
type GithubRepositoryName = z.infer<typeof githubRepositoryNameSchema>;
