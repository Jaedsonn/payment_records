const { createDefaultPreset } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json")
const { pathsToModuleNameMapper } = require("ts-jest");


const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" })
};