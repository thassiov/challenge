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

  async getUserRepository(username: GithubUsername): Promise<UserRepository[]> {
    if (!githubUsernameSchema.safeParse(username).success) {
      logger.error('Username provided is not valid', { data: username });
      throw new ValidationError('Username provided is not valid', { data: username });
    }

    try {
      const repos = await this.ghAPI.getUserRepository(username) as RepositoryRecord[];

      if (!repos.length) {
        return [];
      }

      const promisedRepoInfo = repos.map(async (repo) => {
        const branches = await this.getRepositoryBranches(username, repo.name as string);
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

  private async getRepositoryBranches(username: GithubUsername, repo: GithubRepositoryName): Promise<RepositoryBranch[]> {
    const result = await this.ghAPI.getRepositoryBranches(username, repo);

    if (!result.length) {
      return [];
    }

    const branches = result.map((branch: BranchRecord) => ({ name: branch.name as string, lastCommitSha: (branch.commit as { sha: string }).sha }));

    return branches;
  }
}

export class GithubAPI implements IGithubAPI {
  private readonly BASE_URL = 'https://api.github.com/';
  private readonly DEFAULT_ACCEPT_HEADER = {'Accept': 'application/vnd.github+json'};

  async getUserRepository(username: GithubUsername, reposPerPage = 30): Promise<RepositoryRecord[]> {
    if (!githubUsernameSchema.safeParse(username).success) {
      logger.error('Username provided is not valid', { data: username });
      throw new ValidationError('Username provided is not valid', { data: username });
    }

    try {
      const url = `${this.BASE_URL}/users/${username}/repos?per_page=${reposPerPage}&type=owner`;
      const { data, headers } = await makeGetRequest(url, { headers: { ...this.DEFAULT_ACCEPT_HEADER } });

      let hasNextPage = this.returnNextPageIfPresent(headers as AxiosResponseHeaders);

      if (hasNextPage) {
        while(hasNextPage) {
          const { data: newPageData, headers } = await makeGetRequest(url, { headers: { ...this.DEFAULT_ACCEPT_HEADER } });
          data.concat(newPageData);
          hasNextPage = this.returnNextPageIfPresent(headers as AxiosResponseHeaders);
        }
      }

      return data as RepositoryRecord[];
    } catch (error) {
      logger.error('Could not retrieve the user repos', { data: username });
      throw new HttpRequestError('Could not retrieve the user repos', { data: username }, error as Error);
    }
  }

  async getRepositoryBranches(username: GithubUsername, repoName: GithubRepositoryName, branchesPerPage = 30): Promise<BranchRecord[]> {
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
      const { data, headers } = await makeGetRequest(url, { headers: { ...this.DEFAULT_ACCEPT_HEADER } });

      let hasNextPage = this.returnNextPageIfPresent(headers as AxiosResponseHeaders);

      if (hasNextPage) {
        while(hasNextPage) {
          const { data: newPageData, headers } = await makeGetRequest(url, { headers: { ...this.DEFAULT_ACCEPT_HEADER } });
          data.concat(newPageData);
          hasNextPage = this.returnNextPageIfPresent(headers as AxiosResponseHeaders);
        }
      }

      return data as BranchRecord[];
    } catch (error) {
      logger.error('Could not retrieve the repos branches', { data: { username, repoName } });
      throw new HttpRequestError('Could not retrieve the repos branches', { data: JSON.stringify({ username, repoName }) }, error as Error);
    }
  }

  private returnNextPageIfPresent(headers: AxiosResponseHeaders): string | false {
    const nextToken = '>; rel="next"';

    if (!headers?.link || !headers?.link.includes(nextToken)) {
      return '';
    }

    const nextPageUrl = headers.link
    .split(',')
    .filter('rel="next"')[0]
    .slice(1, nextToken.length);

    if (nextPageUrl) {
      return nextPageUrl;
    }

    return false;
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
  getUserRepository: (username: GithubUsername) => Promise<UserRepository[]>;
};
type IGithubAPI = {
  getUserRepository: (username: GithubUsername, reposPerPage?: number) => Promise<RepositoryRecord[]>;
  getRepositoryBranches: (username: GithubUsername, repoName: GithubRepositoryName, branchesPerPage?: number) => Promise<BranchRecord[]>;
};
type GithubUsername = z.infer<typeof githubUsernameSchema>;
type GithubRepositoryName = z.infer<typeof githubRepositoryNameSchema>;
