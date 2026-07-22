import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";

// Demo login accounts. Passwords are hashed automatically by the User model.
// No demo vehicles are created — an admin adds real cars (with photos) via the UI.
const admin = {
  name: "Admin",
  email: "admin@dealership.com",
  password: "admin123",
  role: "admin",
};
const customer = {
  name: "Demo User",
  email: "user@dealership.com",
  password: "user123",
  role: "user",
};

const run = async () => {
  await connectDB();

  // Start clean: remove any existing accounts and vehicles.
  await User.deleteMany({});
  await Vehicle.deleteMany({});

  await User.create([admin, customer]); // create() runs the password-hash hook

  console.log("Seed complete!");
  console.log(`Admin login -> ${admin.email} / ${admin.password}`);
  console.log(`User login  -> ${customer.email} / ${customer.password}`);
  console.log("No vehicles seeded — log in as admin and add real cars with photos.");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
