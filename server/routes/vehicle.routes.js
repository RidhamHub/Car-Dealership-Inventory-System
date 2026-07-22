import { Router } from "express";
import {
  addVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

// Every vehicle route needs a logged-in user.
router.use(protect);

router.get("/", getVehicles);
router.post("/", adminOnly, addVehicle);
router.put("/:id", adminOnly, updateVehicle);
router.delete("/:id", adminOnly, deleteVehicle);

export default router;
