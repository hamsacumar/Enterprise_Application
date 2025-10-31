// controllers/testController.js
import Test from "../models/testModel.js";

// Get all test data from database
export const getSampleData = async (req, res) => {
  try {
    const testData = await Test.find();
    res.json({
      success: true,
      message: "Data fetched successfully",
      data: testData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message,
    });
  }
};

// Create new test data
export const createTestData = async (req, res) => {
  try {
    const newTest = new Test({
      number: 4,
    });

    const savedTest = await newTest.save();
    res.status(201).json({
      success: true,
      message: "Test data created successfully",
      data: savedTest,
    });
  } catch (error) {
    console.error("Error creating test data:", error);
    res.status(500).json({
      success: false,
      message: "Error creating test data",
      error: error.message,
    });
  }
};

// Initialize database with number 4
export const initializeData = async (req, res) => {
  try {
    // Check if data already exists
    const existingData = await Test.findOne();

    if (existingData) {
      return res.json({
        success: true,
        message: "Data already exists",
        data: existingData,
      });
    }

    // Create initial data with number 4
    const newTest = new Test({
      number: 4,
    });

    const savedTest = await newTest.save();
    res.status(201).json({
      success: true,
      message: "Database initialized with number 4",
      data: savedTest,
    });
  } catch (error) {
    console.error("Error initializing data:", error);
    res.status(500).json({
      success: false,
      message: "Error initializing data",
      error: error.message,
    });
  }
};
