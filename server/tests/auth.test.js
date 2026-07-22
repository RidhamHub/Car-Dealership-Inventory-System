import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/user.model.js";

const validUser = {
  name: "Alice Buyer",
  email: "alice@example.com",
  password: "Secret123",
};

describe("POST /api/auth/register", () => {
  it("registers a new user and returns a JWT + safe user object", async () => {
    const res = await request(app).post("/api/auth/register").send(validUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      name: validUser.name,
      email: validUser.email,
      role: "user", // default role
    });
    // The password hash must never be returned.
    expect(res.body.user).not.toHaveProperty("password");

    // Token should encode the user id and role.
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toMatchObject({ role: "user" });
    expect(decoded.id).toBeDefined();
  });

  it("stores the password as a bcrypt hash, not plaintext", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const stored = await User.findOne({ email: validUser.email }).select("+password");
    expect(stored.password).toBeDefined();
    expect(stored.password).not.toBe(validUser.password);
    expect(stored.password).toMatch(/^\$2[aby]\$/); // bcrypt signature
  });

  it("rejects duplicate emails with 409", async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app).post("/api/auth/register").send(validUser);
    expect(res.status).toBe(409);
  });

  it("rejects invalid payloads with 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password: "123" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(validUser);
  });

  it("logs in with correct credentials and returns a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(validUser.email);
  });

  it("rejects a wrong password with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "WrongPass1" });
    expect(res.status).toBe(401);
  });

  it("rejects an unknown email with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Secret123" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns the current user's profile with a valid token", async () => {
    const reg = await request(app).post("/api/auth/register").send(validUser);
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${reg.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(validUser.email);
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).not.toHaveProperty("password");
  });

  it("rejects requests without a token (401)", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
