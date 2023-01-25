const router = require("express").Router();

const Project = require("../model/project");
const uploader = require("../config/multer");

const { internalError, success, notFound } = require("../apiResponse/response");
const { isAuthenticated } = require("../middlewares/auth");
const { addImage, destroyImage } = require("../config/uploading_cloudinary");

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
      const newProject = new Project(req.body);
      if (req.file) {
        const { public_id, secure_url } = await addImage(req.file.path);
        newProject.projectImg.public_id = public_id;
        newProject.projectImg.url = secure_url;
      }
      await newProject.save();
      return res.status(200).json(success("Project added", null, true));
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
        await destroyImage(project.projectImg.public_id);
        const { public_id, secure_url } = await addImage(req.file.path);
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
      await destroyImage(project.projectImg.public_id);
    }
    await project.remove();
    return res
      .status(200)
      .json(success("Project deleted succesfully", null, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

router.post("/:id", isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json(notFound("Project not found", false));
    }
    return res.status(200).json(success(null, project, true));
  } catch (error) {
    return res.status(500).json(internalError(error.message, false));
  }
});

module.exports = router;
