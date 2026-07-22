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

// Add a vehicle as admin and return its created body.
async function addVehicle(adminToken, quantity = 5) {
  const res = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 20000, quantity });
  return res.body;
}

describe("POST /api/vehicles/:id/purchase", () => {
  it("requires authentication (401)", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin);
    const res = await request(app).post(`/api/vehicles/${car._id}/purchase`);
    expect(res.status).toBe(401);
  });

  it("decreases quantity by 1 by default", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin, 5);
    const user = await tokenFor("user");
    const res = await request(app)
      .post(`/api/vehicles/${car._id}/purchase`)
      .set("Authorization", `Bearer ${user}`);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(4);
  });

  it("decreases quantity by the requested amount", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin, 5);
    const user = await tokenFor("user");
    const res = await request(app)
      .post(`/api/vehicles/${car._id}/purchase`)
      .set("Authorization", `Bearer ${user}`)
      .send({ quantity: 3 });
    expect(res.body.quantity).toBe(2);
  });

  it("rejects purchase when out of stock (400)", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin, 0);
    const user = await tokenFor("user");
    const res = await request(app)
      .post(`/api/vehicles/${car._id}/purchase`)
      .set("Authorization", `Bearer ${user}`);
    expect(res.status).toBe(400);
  });

  it("rejects buying more than available (400)", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin, 2);
    const user = await tokenFor("user");
    const res = await request(app)
      .post(`/api/vehicles/${car._id}/purchase`)
      .set("Authorization", `Bearer ${user}`)
      .send({ quantity: 5 });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a vehicle that does not exist", async () => {
    const user = await tokenFor("user");
    const res = await request(app)
      .post("/api/vehicles/64b2f0000000000000000000/purchase")
      .set("Authorization", `Bearer ${user}`);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/vehicles/:id/restock", () => {
  it("forbids non-admins (403)", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin, 1);
    const user = await tokenFor("user");
    const res = await request(app)
      .post(`/api/vehicles/${car._id}/restock`)
      .set("Authorization", `Bearer ${user}`)
      .send({ quantity: 3 });
    expect(res.status).toBe(403);
  });

  it("lets an admin increase the quantity", async () => {
    const admin = await tokenFor("admin");
    const car = await addVehicle(admin, 1);
    const res = await request(app)
      .post(`/api/vehicles/${car._id}/restock`)
      .set("Authorization", `Bearer ${admin}`)
      .send({ quantity: 4 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(5);
  });

  it("returns 404 for a vehicle that does not exist", async () => {
    const admin = await tokenFor("admin");
    const res = await request(app)
      .post("/api/vehicles/64b2f0000000000000000000/restock")
      .set("Authorization", `Bearer ${admin}`)
      .send({ quantity: 1 });
    expect(res.status).toBe(404);
  });
});
