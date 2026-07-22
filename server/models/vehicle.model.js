import mongoose from "mongoose";

// A car in the dealership inventory.
const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    // Uploaded photos, each stored as a base64 data URL. Empty if none provided.
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
