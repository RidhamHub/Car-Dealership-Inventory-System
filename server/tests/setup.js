import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Test lifecycle:
 *  - Before the suite: boot an in-memory MongoDB and connect Mongoose to it.
 *    This gives tests a real MongoDB API (indexes, queries, validation) without
 *    touching the developer's Atlas cluster.
 *  - After each test: wipe every collection so tests stay isolated.
 *  - After the suite: disconnect and stop the in-memory server.
 */
let mongoServer;

// Deterministic secret so JWTs can be signed/verified during tests.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "car-dealership-test" });
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});
