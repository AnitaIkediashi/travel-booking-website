import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Path to your Next.js app, loads next.config.js and .env files
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // match your tsconfig paths, e.g. "@/*": ["./*"]
    "^@/(.*)$": "<rootDir>/$1",
  },
};

// createJestConfig is exported this way to ensure next/jest can load the Next.js config, which is async
export default createJestConfig(config);
