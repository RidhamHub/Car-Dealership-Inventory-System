import { Router } from "express";
import {
  addVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from "../controllers/vehicle.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

// Every vehicle route needs a logged-in user.
router.use(protect);

router.get("/", getVehicles);
// Must come before "/:id" so "search" isn't treated as an id.
router.get("/search", searchVehicles);
router.post("/", adminOnly, addVehicle);
router.put("/:id", adminOnly, updateVehicle);
router.delete("/:id", adminOnly, deleteVehicle);

// Inventory: any user can buy; only admins can restock.
router.post("/:id/purchase", purchaseVehicle);
router.post("/:id/restock", adminOnly, restockVehicle);

export default router;
