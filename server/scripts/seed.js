import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
import Vehicle from "../models/vehicle.model.js";

// Demo accounts. Passwords are hashed automatically by the User model.
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

// A mix of makes, categories and prices so search/filter has something to show.
// One car is out of stock (quantity 0) to demo the disabled "Purchase" button.
const vehicles = [
  { make: "Toyota", model: "Corolla", category: "Sedan", price: 20000, quantity: 6 },
  { make: "Toyota", model: "RAV4", category: "SUV", price: 32000, quantity: 4 },
  { make: "Honda", model: "Civic", category: "Sedan", price: 22000, quantity: 5 },
  { make: "Honda", model: "CR-V", category: "SUV", price: 30000, quantity: 3 },
  { make: "Ford", model: "Explorer", category: "SUV", price: 40000, quantity: 2 },
  { make: "Ford", model: "Mustang", category: "Coupe", price: 55000, quantity: 1 },
  { make: "Tesla", model: "Model 3", category: "Sedan", price: 45000, quantity: 0 },
  { make: "Hyundai", model: "Tucson", category: "SUV", price: 28000, quantity: 7 },
];

const run = async () => {
  await connectDB();

  // Start fresh so the demo data is predictable each time.
  await User.deleteMany({});
  await Vehicle.deleteMany({});

  await User.create([admin, customer]); // create() runs the password-hash hook
  await Vehicle.insertMany(vehicles);

  console.log("Seed complete!");
  console.log(`Admin login -> ${admin.email} / ${admin.password}`);
  console.log(`User login  -> ${customer.email} / ${customer.password}`);
  console.log(`Vehicles added: ${vehicles.length}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
