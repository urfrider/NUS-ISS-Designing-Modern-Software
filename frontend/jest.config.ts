import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node", // Selenium opens real browser, don't need jsdom
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/test/selenium/**/*.test.ts"], // find all your selenium tests
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./html-report",
        filename: "report.html",
        expand: true,
      },
    ],
  ],
  testTimeout: 30000, // important for Selenium! 30 sec timeout
};

export default config;
