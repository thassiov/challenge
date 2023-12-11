import type {Config} from 'jest';

import jestMainConfig from './jest.config';

const config: Config = {
  ...jestMainConfig,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
};

export default config;
