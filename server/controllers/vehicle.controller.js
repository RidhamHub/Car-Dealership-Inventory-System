import mongoose from "mongoose";
import Vehicle from "../models/vehicle.model.js";

// POST /api/vehicles  (admin only)
export const addVehicle = async (req, res) => {
  try {
    const { make, model, category, price, quantity, images } = req.body;

    if (!make || !model || !category || price === undefined) {
      return res
        .status(400)
        .json({ message: "make, model, category and price are required" });
    }
    if (price < 0 || (quantity ?? 0) < 0) {
      return res.status(400).json({ message: "price and quantity cannot be negative" });
    }

    const vehicle = await Vehicle.create({ make, model, category, price, quantity, images });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/vehicles  (any logged-in user)
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/vehicles/:id  (any logged-in user) — full details for one vehicle
export const getVehicleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/vehicles/search  (any logged-in user)
// Optional query params: make, model, category, minPrice, maxPrice
export const searchVehicles = async (req, res) => {
  try {
    const { make, model, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    // Text fields use a case-insensitive partial match.
    if (make) filter.make = { $regex: make, $options: "i" };
    if (model) filter.model = { $regex: model, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };

    // Price range: build { $gte, $lte } only for the bounds provided.
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort: price low->high, price high->low, or newest first (default).
    let sortBy = { createdAt: -1 };
    if (sort === "price_asc") sortBy = { price: 1 };
    else if (sort === "price_desc") sortBy = { price: -1 };

    const vehicles = await Vehicle.find(filter).sort(sortBy);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// PUT /api/vehicles/:id  (admin only)
export const updateVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // still enforce the schema rules
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/vehicles/:id/purchase  (any logged-in user)
// Buys `quantity` units (default 1), reducing the stock.
export const purchaseVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const amount = Number(req.body.quantity) || 1;
    if (amount < 1) {
      return res.status(400).json({ message: "Purchase quantity must be at least 1" });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    if (vehicle.quantity < amount) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    vehicle.quantity -= amount;
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// POST /api/vehicles/:id/restock  (admin only)
// Adds `quantity` units (default 1) back into stock.
export const restockVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const amount = Number(req.body.quantity) || 1;
    if (amount < 1) {
      return res.status(400).json({ message: "Restock quantity must be at least 1" });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.quantity += amount;
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE /api/vehicles/:id  (admin only)
export const deleteVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
