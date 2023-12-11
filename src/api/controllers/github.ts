import { Request, Response } from "express";
import { z } from "zod";
import { logger } from "../../utils/logger";
import { ApiError } from "../../utils/errors";
import { GithubService } from "../../services";
import { UserRepository } from "../../services/github";

const queryStringSchema = z.object({
  username: z.string().min(1),
  token: z.string().optional(),
});

export async function githubHandler(req: Request, res: Response): Promise<void> {
  if ((req.headers as { accept: string })?.accept !== 'application/json' ) {
    res.status(400);
    res.send('The request must come with the header { accept: application/json }');
    return;
  }

  if (!req.query || !queryStringSchema.safeParse(req.query).success) {
    logger.error('Cannot serve request: the given querystring is not in a valid format');
    res.status(400);
    res.send('Cannot serve request: the given querystring is not in a valid format');
    return;
  }

  const ghService = new GithubService();

  const authToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

  try {
    const userRepoList: UserRepository[] = await ghService.getUserRepository(req.query.username as string, authToken);
    res.status(200);
    res.send({ data: userRepoList });
  } catch (error) {
    logger.error(`An error occurred during the processing of the request`, { data: JSON.stringify(req.headers) });
    throw new ApiError(`An error occurred during the processing of the request: ${(error as Error).message}`, { data: JSON.stringify(req.headers) }, error as Error);
  }
}
