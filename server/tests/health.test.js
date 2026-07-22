import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Health check", () => {
  it("GET / returns service status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });

  it("unknown routes return 404 JSON", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});
