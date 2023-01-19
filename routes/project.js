const router = require("express").Router();
const cloudinary = require("cloudinary").v2;

const Project = require("../model/project");
const uploader = require("../config/multer");
const { internalError, success, notFound } = require("../apiResponse/response");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    const project = await Project.find();
    return res.status(200).json(success(null, project, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post(
  "/add",
  isAuthenticated,
  uploader.single("projectImg"),
  async (req, res) => {
    try {
      const { title, link } = req.body;
      const { public_id, secure_url: url } = await cloudinary.uploader.upload(
        req.file.path
      );
      const newProject = new Project({
        title,
        link,
        projectImg: {
          public_id,
          url,
        },
      });
      await newProject.save();
      return res
        .status(200)
        .json(success("Project added succesfully", null, true));
    } catch (error) {
      return res.status(500).json(internalError(error.message, false));
    }
  }
);

router.post(
  "/update/:id",
  isAuthenticated,
  uploader.single("projectImg"),
  async (req, res) => {
    try {
      const { title, link, projectImg } = req.body;
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json(notFound("Project not found", false));
      }
      if (title) {
        project.title = title;
      }
      if (link) {
        project.link = link;
      }
      if (projectImg) {
        await cloudinary.uploader.destroy(project.projectImg.public_id);
        const { public_id, secure_url } = await cloudinary.uploader.upload(
          req.file.path
        );
        project.projectImg.public_id = public_id;
        project.projectImg.url = secure_url;
      }
      await project.save();
      return res
        .status(200)
        .json(success("Project updated succesfully", null, true));
    } catch (error) {
      return res.status(500).json(internalError(error.message, false));
    }
  }
);

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json(notFound("Project not found", false));
    }
    if (project.projectImg) {
      await cloudinary.uploader.destroy(project.projectImg.public_id);
    }
    await project.remove();
    return res
      .status(200)
      .json(success("Project deleted succesfully", null, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

module.exports = router;
