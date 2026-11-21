const nextJest = require("next/jest");

// next/jest wires up SWC so .ts/.tsx tests compile the same way as the app
const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  setupFilesAfterEnv: ["./test/jest.setup.ts"],
  moduleDirectories: ["node_modules", "src"],
});
