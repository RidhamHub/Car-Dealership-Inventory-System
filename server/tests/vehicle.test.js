import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";

const password = "Secret123";

// Create a user with the given role and return a valid login token for it.
async function tokenFor(role) {
  const email = `${role}-${Date.now()}-${Math.random()}@test.com`;
  await User.create({ name: `${role} user`, email, password, role });
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.token;
}

const sampleVehicle = {
  make: "Toyota",
  model: "Corolla",
  category: "Sedan",
  price: 20000,
  quantity: 5,
};

// Small helper: POST a vehicle as an admin and return the created body.
async function addVehicle(adminToken, data = sampleVehicle) {
  const res = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(data);
  return res.body;
}

describe("POST /api/vehicles", () => {
  it("rejects unauthenticated requests with 401", async () => {
    const res = await request(app).post("/api/vehicles").send(sampleVehicle);
    expect(res.status).toBe(401);
  });

  it("forbids non-admin users with 403", async () => {
    const token = await tokenFor("user");
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleVehicle);
    expect(res.status).toBe(403);
  });

  it("lets an admin add a vehicle (201)", async () => {
    const token = await tokenFor("admin");
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send(sampleVehicle);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(sampleVehicle);
    expect(res.body).toHaveProperty("_id");
  });

  it("rejects invalid vehicle data with 400", async () => {
    const token = await tokenFor("admin");
    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota" }); // missing model, category, price...
    expect(res.status).toBe(400);
  });
});

describe("GET /api/vehicles", () => {
  it("requires authentication (401)", async () => {
    const res = await request(app).get("/api/vehicles");
    expect(res.status).toBe(401);
  });

  it("returns all vehicles for a logged-in user", async () => {
    const admin = await tokenFor("admin");
    await addVehicle(admin);
    const user = await tokenFor("user");
    const res = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${user}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });
});

describe("PUT /api/vehicles/:id", () => {
  it("lets an admin update a vehicle", async () => {
    const token = await tokenFor("admin");
    const created = await addVehicle(token);
    const res = await request(app)
      .put(`/api/vehicles/${created._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 18000 });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(18000);
  });

  it("returns 404 for a vehicle that does not exist", async () => {
    const token = await tokenFor("admin");
    const res = await request(app)
      .put("/api/vehicles/64b2f0000000000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send({ price: 1 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/vehicles/:id", () => {
  it("forbids non-admins (403)", async () => {
    const admin = await tokenFor("admin");
    const created = await addVehicle(admin);
    const user = await tokenFor("user");
    const res = await request(app)
      .delete(`/api/vehicles/${created._id}`)
      .set("Authorization", `Bearer ${user}`);
    expect(res.status).toBe(403);
  });

  it("lets an admin delete a vehicle", async () => {
    const token = await tokenFor("admin");
    const created = await addVehicle(token);
    const res = await request(app)
      .delete(`/api/vehicles/${created._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);

    const list = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);
    expect(list.body).toHaveLength(0);
  });
});
