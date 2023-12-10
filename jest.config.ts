import type {Config} from 'jest';

const config: Config = {
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src/"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleFileExtensions: ["ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  testRegex: "\\.test\\.ts$",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
};

export default config;
