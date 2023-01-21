const router = require("express").Router();
const cloudinary = require("cloudinary").v2;

const uploader = require("../config/multer");

const Education = require("../model/education");

const { internalError, success } = require("../apiResponse/response");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    const education = await Education.find();
    return res.status(200).json(success(null, education, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post(
  "/new-education",
  isAuthenticated,
  uploader.single("logo"),
  async (req, res) => {
    try {
      const newEducation = new Education(req.body);
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        req.file.path
      );
      newEducation.logo.public_id = public_id;
      newEducation.logo.url = secure_url;
      await newEducation.save();
      return res.status(200).json(success("Education added", null, true));
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
      const updatedEducation = await Education.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      if (!updatedEducation) {
        return res.status(404).json(notFound("Education not found", false));
      }
      if (req.body.logo) {
        await cloudinary.uploader.destroy(updatedEducation.logo.public_id);
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          req.file.path
        );
        updatedEducation.logo.public_id = public_id;
        updatedEducation.logo.url = secure_url;
      }
      await updatedEducation.save();
      return res.status(200).json(success("Education updated", null, true));
    } catch (error) {
      return res.status(500).json(internalError(error.message, false));
    }
  }
);

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const deleteEducation = await Education.findById(req.params.id);
    if (!deleteEducation) {
      return res.status(404).json(notFound("Education not found", false));
    }
    if (deleteEducation.logo) {
      await cloudinary.uploader.destroy(deleteEducation.logo.public_id);
    }
    await deleteEducation.remove();
    return res.status(200).json(success("Education deleted", null, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

module.exports = router;
