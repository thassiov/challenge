import express from 'express';
import { configs } from '../utils';
import { logger } from '../utils/logger';
import pinoHttp from 'pino-http';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';
import { githubHandler } from './controllers';
import { httpErrorResponseHandler } from './middlewares/error';


export function startApi() {
  const api = express();

  api.use(pinoHttp());
  api.use(bodyParser.urlencoded({ extended: false }));

  api.get('/get-repos', asyncHandler(githubHandler));

  api.use(httpErrorResponseHandler);

  api.listen(configs.API_PORT, () => {
    logger.info(`Server started at http://localhost:${configs.API_PORT}`);
  });

  api.on('error', (err) => {
    logger.error('Error encontered when running the server', { data: JSON.stringify(err, null, 2)});
    logger.error('Exiting');
    process.exit(1);
  });
}

