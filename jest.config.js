const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src" }),
  
  transformIgnorePatterns: [
    "node_modules/(?!@faker-js/faker)"
  ],
  
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { useESM: true }],
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};