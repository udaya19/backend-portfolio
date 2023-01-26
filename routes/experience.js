const router = require("express").Router();

const Experience = require("../model/experience");
const uploader = require("../config/multer");

const { internalError, success, notFound } = require("../apiResponse/response");
const { addImage, destroyImage } = require("../config/uploading_cloudinary");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    const experience = await Experience.find();
    return res.status(200).json(success(null, experience, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post(
  "/new-experience",
  isAuthenticated,
  uploader.single("logo"),
  async (req, res) => {
    try {
      const newExperience = new Experience(req.body);
      if (req.file) {
        const { public_id, secure_url } = await addImage(req.file.path);
        newExperience.logo.public_id = public_id;
        newExperience.logo.url = secure_url;
      }
      await newExperience.save();
      return res.status(200).json(success("New experience added", null, true));
    } catch (error) {
      return res.status(500).json(internalError(error.message, false));
    }
  }
);

router.post(
  "/update/:id",
  isAuthenticated,
  uploader.single("logo"),
  async (req, res) => {
    try {
      const updateExperience = await Experience.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!updateExperience) {
        return res.status(404).json(notFound("Experience not found", false));
      }
      if (req.file) {
        if (updateExperience.logo && updateExperience.logo.public_id) {
          await destroyImage(updateExperience.logo.public_id);
        }
        const { public_id, secure_url } = await addImage(req.file.path);
        updateExperience.logo.public_id = public_id;
        updateExperience.logo.url = secure_url;
      }
      await updateExperience.save();
      return res.status(200).json(success("Updated succesfully", null, true));
    } catch (error) {
      return res.status(500).json(internalError(error.message, false));
    }
  }
);

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json(notFound("Experience not found", false));
    }
    if (experience.logo && experience.logo.public_id) {
      await destroyImage(experience.logo.public_id);
    }
    await experience.remove();
    return res.status(200).json(success("Experience deleted", null, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post("/:id", isAuthenticated, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json(notFound("Experience not found", false));
    }
    return res.status(200).json(success(null, experience, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

module.exports = router;
