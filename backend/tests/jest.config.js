export default {
    testEnvironment: "node",
    transform: {},
    extensionsToTreatAsEsm: [".js"],
    globals: {
      "ts-jest": {
        useESM: true,
      },
    },
    setupFiles: ["dotenv/config"],
  };
  