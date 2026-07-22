import { defineConfig } from "vitest/config";
import fs from "node:fs";
import path from "node:path";

/**
 * mongodb-memory-server normally downloads a ~780MB MongoDB binary on first
 * run. When a MongoDB server is already installed locally we reuse its `mongod`
 * binary via MONGOMS_SYSTEM_BINARY, avoiding the download entirely. If nothing
 * is found we leave the env untouched and let memory-server download on demand.
 */
function findSystemMongod() {
  if (process.env.MONGOMS_SYSTEM_BINARY) return process.env.MONGOMS_SYSTEM_BINARY;

  const candidates = [];
  if (process.platform === "win32") {
    const base = "C:/Program Files/MongoDB/Server";
    if (fs.existsSync(base)) {
      for (const ver of fs.readdirSync(base)) {
        candidates.push(path.join(base, ver, "bin", "mongod.exe"));
      }
    }
  } else {
    candidates.push("/usr/bin/mongod", "/usr/local/bin/mongod", "/opt/homebrew/bin/mongod");
  }
  return candidates.find((p) => fs.existsSync(p));
}

const systemMongod = findSystemMongod();

export default defineConfig({
  test: {
    environment: "node",
    // Boot / tear down the in-memory MongoDB via tests/setup.js.
    setupFiles: ["./tests/setup.js"],
    // First run may download the MongoDB binary; give hooks room to do so.
    hookTimeout: 120000,
    testTimeout: 20000,
    // Mongoose + one shared in-memory server prefer serial test files.
    fileParallelism: false,
    // Pass the resolved system binary (if any) down to the test worker.
    env: systemMongod ? { MONGOMS_SYSTEM_BINARY: systemMongod } : {},
    coverage: {
      provider: "v8",
      include: ["controllers/**", "models/**", "middleware/**", "utils/**"],
      reporter: ["text", "html"],
    },
  },
});
