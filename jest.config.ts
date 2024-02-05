export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        esModuleInterop: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "json"],
};
