import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Car Dealership Inventory API" });
});

// Feature routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// 404 + centralized error handling (must be registered last)
app.use(notFound);
app.use(errorHandler);

export default app;
