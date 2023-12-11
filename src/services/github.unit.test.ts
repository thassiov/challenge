import { makeGetRequest } from '../utils/fetch';
import { BranchRecord, GithubAPI, GithubService, RepositoryBranch, RepositoryRecord, UserRepository } from "./github";

jest.mock('../utils/fetch')

describe('Github Service', () => {
  const mockRepositoryData: RepositoryRecord = {
    "id": 1296269,
    "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
    "name": "Hello-World",
    "full_name": "octocat/Hello-World",
    "owner": {
      "login": "octocat",
      "id": 1,
      "node_id": "MDQ6VXNlcjE=",
        "avatar_url": "https://github.com/images/error/octocat_happy.gif",
        "gravatar_id": "",
      "url": "https://api.github.com/users/octocat",
        "html_url": "https://github.com/octocat",
        "followers_url": "https://api.github.com/users/octocat/followers",
        "following_url": "https://api.github.com/users/octocat/following{/other_user}",
        "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
        "organizations_url": "https://api.github.com/users/octocat/orgs",
        "repos_url": "https://api.github.com/users/octocat/repos",
        "events_url": "https://api.github.com/users/octocat/events{/privacy}",
        "received_events_url": "https://api.github.com/users/octocat/received_events",
        "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/octocat/Hello-World",
      "description": "This your first repo!",
    "fork": false,
    "url": "https://api.github.com/repos/octocat/Hello-World",
      "archive_url": "https://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}",
      "assignees_url": "https://api.github.com/repos/octocat/Hello-World/assignees{/user}",
      "blobs_url": "https://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}",
      "branches_url": "https://api.github.com/repos/octocat/Hello-World/branches{/branch}",
      "collaborators_url": "https://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}",
      "comments_url": "https://api.github.com/repos/octocat/Hello-World/comments{/number}",
      "commits_url": "https://api.github.com/repos/octocat/Hello-World/commits{/sha}",
      "compare_url": "https://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}",
      "contents_url": "https://api.github.com/repos/octocat/Hello-World/contents/{+path}",
      "contributors_url": "https://api.github.com/repos/octocat/Hello-World/contributors",
      "deployments_url": "https://api.github.com/repos/octocat/Hello-World/deployments",
      "downloads_url": "https://api.github.com/repos/octocat/Hello-World/downloads",
      "events_url": "https://api.github.com/repos/octocat/Hello-World/events",
      "forks_url": "https://api.github.com/repos/octocat/Hello-World/forks",
      "git_commits_url": "https://api.github.com/repos/octocat/Hello-World/git/commits{/sha}",
      "git_refs_url": "https://api.github.com/repos/octocat/Hello-World/git/refs{/sha}",
      "git_tags_url": "https://api.github.com/repos/octocat/Hello-World/git/tags{/sha}",
      "git_url": "git:github.com/octocat/Hello-World.git",
    "issue_comment_url": "https://api.github.com/repos/octocat/Hello-World/issues/comments{/number}",
      "issue_events_url": "https://api.github.com/repos/octocat/Hello-World/issues/events{/number}",
      "issues_url": "https://api.github.com/repos/octocat/Hello-World/issues{/number}",
      "keys_url": "https://api.github.com/repos/octocat/Hello-World/keys{/key_id}",
      "labels_url": "https://api.github.com/repos/octocat/Hello-World/labels{/name}",
      "languages_url": "https://api.github.com/repos/octocat/Hello-World/languages",
      "merges_url": "https://api.github.com/repos/octocat/Hello-World/merges",
      "milestones_url": "https://api.github.com/repos/octocat/Hello-World/milestones{/number}",
      "notifications_url": "https://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
      "pulls_url": "https://api.github.com/repos/octocat/Hello-World/pulls{/number}",
      "releases_url": "https://api.github.com/repos/octocat/Hello-World/releases{/id}",
      "ssh_url": "git@github.com:octocat/Hello-World.git",
    "stargazers_url": "https://api.github.com/repos/octocat/Hello-World/stargazers",
      "statuses_url": "https://api.github.com/repos/octocat/Hello-World/statuses/{sha}",
      "subscribers_url": "https://api.github.com/repos/octocat/Hello-World/subscribers",
      "subscription_url": "https://api.github.com/repos/octocat/Hello-World/subscription",
      "tags_url": "https://api.github.com/repos/octocat/Hello-World/tags",
      "teams_url": "https://api.github.com/repos/octocat/Hello-World/teams",
      "trees_url": "https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}",
      "clone_url": "https://github.com/octocat/Hello-World.git",
      "mirror_url": "git:git.example.com/octocat/Hello-World",
    "hooks_url": "https://api.github.com/repos/octocat/Hello-World/hooks",
      "svn_url": "https://svn.github.com/octocat/Hello-World",
      "homepage": "https://github.com",
      "language": null,
    "forks_count": 9,
    "stargazers_count": 80,
    "watchers_count": 80,
    "size": 108,
    "default_branch": "master",
    "open_issues_count": 0,
    "is_template": false,
    "topics": [
      "octocat",
      "atom",
      "electron",
      "api"
    ],
    "has_issues": true,
    "has_projects": true,
    "has_wiki": true,
    "has_pages": false,
    "has_downloads": true,
    "has_discussions": false,
    "archived": false,
    "disabled": false,
    "visibility": "public",
    "pushed_at": "2011-01-26T19:06:43Z",
    "created_at": "2011-01-26T19:01:12Z",
    "updated_at": "2011-01-26T19:14:43Z",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    },
    "security_and_analysis": {
      "advanced_security": {
        "status": "enabled"
      },
      "secret_scanning": {
        "status": "enabled"
      },
      "secret_scanning_push_protection": {
        "status": "disabled"
      }
    }
  };

  const mockBranchData: BranchRecord = {
    "name": "master",
    "commit": {
      "sha": "c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc",
      "url": "https://api.github.com/repos/octocat/Hello-World/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc"
    },
      "protected": true,
      "protection": {
        "required_status_checks": {
          "enforcement_level": "non_admins",
          "contexts": [
            "ci-test",
            "linter"
          ]
        }
      },
      "protection_url": "https://api.github.com/repos/octocat/hello-world/branches/master/protection"
  };

  const mockReposData: UserRepository[] = [
    {
      owner: (mockRepositoryData.owner as { login: string }).login as string,
      repositoryName: mockRepositoryData.name as string,
      branches: [
        {
          name: mockBranchData.name,
          lastCommitSha: (mockBranchData.commit as { sha: string }).sha,
        } as RepositoryBranch,
      ],
    }
  ]

  const mockUsername = 'thisuserexists';
  const mockRepoName = 'thisrepoexists';

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('Service', () => {
    it('should get the list of repositories from a user', async () => {
      (makeGetRequest as jest.Mock).mockResolvedValueOnce({ data: [mockRepositoryData], headers: {} });
      (makeGetRequest as jest.Mock).mockResolvedValueOnce({ data: [mockBranchData], headers: {} });

      const service = new GithubService();

      const result = await service.getUserRepository(mockUsername);

      expect(result).toStrictEqual(mockReposData);
    });

    it.each([
      [0],
      [false],
      [{}],
      ['']
    ] as unknown[])('should failt to get the user repo information', async (faultyUsername) => {
      const service = new GithubService();
      await expect(service.getUserRepository(faultyUsername as string)).rejects.toThrow('Username provided is not valid');
    });
  });

  describe('GithubAPI module', () => {
    it.each([
      [0],
      [false],
      [{}],
      ['']
    ] as unknown[])('should fail to make a request user repos by sending an invalid username ( %p )', async (faultyUsername) => {
      const ghApi = new GithubAPI();
      await expect(ghApi.getUserRepository(faultyUsername as string)).rejects.toThrow('Username provided is not valid');
    });

    it('should make a request to user repos', async () => {
      const ghApi = new GithubAPI();

      (makeGetRequest as jest.Mock).mockResolvedValueOnce({ data: [mockRepositoryData], headers: {} });

      const result = await ghApi.getUserRepository(mockUsername);

      expect(result).toStrictEqual([mockRepositoryData]);
    });

    it.each([
      [0],
      [false],
      [{}],
      ['']
    ] as unknown[])('should fail to make a request user repos by sending an invalid username ( %p )', async (faultyUsername) => {
      const ghApi = new GithubAPI();
      await expect(ghApi.getUserRepository(faultyUsername as string)).rejects.toThrow('Username provided is not valid');
    });

    it.each([
      [0],
      [false],
      [{}],
      ['']
    ] as unknown[])('should fail to fetch a repo branches sending an invalid repository name ( %p )', async (faultyRepoName) => {
      const ghApi = new GithubAPI();
      await expect(ghApi.getRepositoryBranches(mockUsername, faultyRepoName as string)).rejects.toThrow('Repository provided is not valid');
    });

    it('should fetch a repos branches', async () => {
      const ghApi = new GithubAPI();

      (makeGetRequest as jest.Mock).mockResolvedValueOnce({ data: [mockBranchData], headers: {} });

      const result = await ghApi.getRepositoryBranches(mockUsername, mockRepoName);

      expect(result).toStrictEqual([mockBranchData]);
    });
  });
});

