import dotenv from 'dotenv';
dotenv.config();

export const configs = {
  API_PORT: process.env.api_port || 8080,
};
