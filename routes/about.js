const express = require("express");
const router = express.Router();

const About = require("../model/about");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    const about = await About.find();
    return res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    const newAbout = new About({
      content,
    });
    await newAbout.save();
    return res.status(200).json({
      success: true,
      message: "Content added succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/:id", isAuthenticated, async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
    return res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/update/:id", isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    const newAbout = await About.findByIdAndUpdate(req.params.id, { content });
    if (!newAbout) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
    await newAbout.save();
    res.json(200, {
      message: "About us updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Content deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
