import axios, { AxiosError, AxiosResponse } from 'axios';

import { z } from 'zod';
import { logger } from '../logger';
import { HttpRequestError } from '../errors';

const urlSchema = z.string().url();

type IURL = z.infer<typeof urlSchema>;

const headersSchema = z.object({});

export type IHeaders = z.infer<typeof headersSchema>;

export async function makeGetRequest(url: IURL, headers: IHeaders = {}): Promise<AxiosResponse> {
  try {
    const result = await axios.get(url, headers);

    return result;
  } catch (error) {
    const statusCode = (error as AxiosError).response?.status;
    logger.error(`Failed to make GET request: statusCode: ${statusCode}`, { data: url });
    throw new HttpRequestError(`Cannot make GET request: statusCode: ${statusCode}`, { data: url }, error as Error);
  }
}
