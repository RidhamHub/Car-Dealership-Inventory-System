import { describe, it, expect, beforeEach } from "vitest";
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

const vehicles = [
  { make: "Toyota", model: "Corolla", category: "Sedan", price: 20000, quantity: 3 },
  { make: "Toyota", model: "RAV4", category: "SUV", price: 32000, quantity: 2 },
  { make: "Honda", model: "Civic", category: "Sedan", price: 22000, quantity: 5 },
  { make: "Ford", model: "Explorer", category: "SUV", price: 40000, quantity: 1 },
];

async function seed(adminToken) {
  for (const v of vehicles) {
    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(v);
  }
}

describe("GET /api/vehicles/search", () => {
  let userToken;

  beforeEach(async () => {
    const admin = await tokenFor("admin");
    await seed(admin);
    userToken = await tokenFor("user");
  });

  const search = (query) =>
    request(app)
      .get(`/api/vehicles/search${query}`)
      .set("Authorization", `Bearer ${userToken}`);

  it("requires authentication (401)", async () => {
    const res = await request(app).get("/api/vehicles/search?make=Toyota");
    expect(res.status).toBe(401);
  });

  it("filters by make (case-insensitive)", async () => {
    const res = await search("?make=toyota");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((v) => v.make === "Toyota")).toBe(true);
  });

  it("filters by category", async () => {
    const res = await search("?category=SUV");
    expect(res.body).toHaveLength(2);
  });

  it("filters by model", async () => {
    const res = await search("?model=civic");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].model).toBe("Civic");
  });

  it("filters by price range", async () => {
    const res = await search("?minPrice=21000&maxPrice=35000");
    expect(res.body.map((v) => v.model).sort()).toEqual(["Civic", "RAV4"]);
  });

  it("combines filters (category + max price)", async () => {
    const res = await search("?category=SUV&maxPrice=35000");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].model).toBe("RAV4");
  });

  it("returns all vehicles when no filter is given", async () => {
    const res = await search("");
    expect(res.body).toHaveLength(4);
  });

  it("sorts by price low to high", async () => {
    const res = await search("?sort=price_asc");
    const prices = res.body.map((v) => v.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(prices[0]).toBe(20000);
  });

  it("sorts by price high to low", async () => {
    const res = await search("?sort=price_desc");
    const prices = res.body.map((v) => v.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
    expect(prices[0]).toBe(40000);
  });
});
