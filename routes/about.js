const express = require("express");
const router = express.Router();

const About = require("../model/about");
const uploader = require("../config/multer");
const { isAuthenticated } = require("../middlewares/auth");
const { success, internalError, notFound } = require("../apiResponse/response");

router.get("/", async (req, res) => {
  try {
    const about = await About.find();
    return res.status(200).json(success(null, about, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post("/add", uploader.none(), isAuthenticated, async (req, res) => {
  try {
    const { content } = req.body;
    const newAbout = new About({
      content,
    });
    await newAbout.save();
    return res
      .status(200)
      .json(success("Content added succesfully", null, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post("/:id", isAuthenticated, async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json(notFound("Content not found", false));
    }
    return res.status(200).json(success(null, about, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post(
  "/update/:id",
  uploader.none(),
  isAuthenticated,
  async (req, res) => {
    try {
      const { content } = req.body;
      const newAbout = await About.findByIdAndUpdate(req.params.id, {
        content,
      });
      if (!newAbout) {
        return res.status(404).json(notFound("Not Found", false));
      }
      await newAbout.save();
      res.status(200).json(success("Content updated", null, true));
    } catch (error) {
      return res.status(500).json(internalError(error.message, false));
    }
  }
);

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);
    if (!about) {
      return res.status(404).json(notFound("Not found", false));
    }
    return res.status(200).json(success("Content deleted", null, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

module.exports = router;
