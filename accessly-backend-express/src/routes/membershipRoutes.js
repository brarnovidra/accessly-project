import express from "express";
import {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} from "../controllers/membershipController.js";
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", getMemberships);
router.get("/:id", getMembershipById);
router.post("/", authenticate, createMembership);
router.put("/:id", authenticate, updateMembership);
router.delete("/:id", authenticate, deleteMembership);

export default router;