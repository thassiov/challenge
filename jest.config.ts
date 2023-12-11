import type {Config} from 'jest';

const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest",
  testRegex: "\\.test\\.ts$",
};

export default config;
