import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils/logger";
import { CustomError } from "../../utils/errors";
import { configs } from "../../utils";

export function httpErrorResponseHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  logger.error(`Handled uncaught error. Msg: ${err.message}.`);

  if (configs.environment === 'development' && err instanceof CustomError) {
    const details = unwrapErrorMessage(err);
    res.status(500).send(details);
  } else {
    res.status(500).send("Something went wrong");
  }
}

function unwrapErrorMessage(err: CustomError, msg = ''): string {
  const info = `${err.message}${err.details ? ': ' + JSON.stringify(err.details) : ''}`;
  let message = !msg.length ? info : `${msg}\n${info}` ;

  if (err.cause) {
    message +=`\n${err.cause}`;
  }

  if (!err.details) {
    if (err.stack) {
      message += `\n${err.stack}`;
    }
    return message
  }

  message = unwrapErrorMessage((err.cause as Error), message);

  return message;
}
