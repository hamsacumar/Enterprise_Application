// routes/testRoutes.js
import express from "express";
import {
  getSampleData,
  createTestData,
  initializeData,
} from "../controllers/testController.js";

const router = express.Router();

// GET /api/test - Fetch all test data
router.get("/", getSampleData);

// POST /api/test - Create new test data
router.post("/", createTestData);

// POST /api/test/init - Initialize database with number 4
router.post("/init", initializeData);

export default router;
