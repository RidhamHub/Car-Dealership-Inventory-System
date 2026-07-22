import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";

const password = "Secret123";

async function tokenFor(role) {
  const email = `${role}-${Date.now()}-${Math.random()}@test.com`;
  await User.create({ name: `${role} user`, email, password, role });
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.token;
}

const withYear = {
  make: "Lamborghini",
  model: "Aventador",
  category: "Coupe",
  year: 2022,
  price: 400000,
  quantity: 2,
};

describe("vehicle year field", () => {
  it("stores year on create and returns it", async () => {
    const admin = await tokenFor("admin");
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${admin}`)
      .send(withYear);
    expect(res.status).toBe(201);
    expect(res.body.year).toBe(2022);
  });

  it("persists year when fetched by id", async () => {
    const admin = await tokenFor("admin");
    const created = (
      await request(app).post("/api/vehicles").set("Authorization", `Bearer ${admin}`).send(withYear)
    ).body;
    const res = await request(app)
      .get(`/api/vehicles/${created._id}`)
      .set("Authorization", `Bearer ${admin}`);
    expect(res.status).toBe(200);
    expect(res.body.year).toBe(2022);
  });

  it("updates year via PUT", async () => {
    const admin = await tokenFor("admin");
    const created = (
      await request(app).post("/api/vehicles").set("Authorization", `Bearer ${admin}`).send(withYear)
    ).body;
    const res = await request(app)
      .put(`/api/vehicles/${created._id}`)
      .set("Authorization", `Bearer ${admin}`)
      .send({ year: 2019 });
    expect(res.status).toBe(200);
    expect(res.body.year).toBe(2019);
  });
});
