const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const uploader = require("../config/multer");
const { estimatedDocumentCount } = require("../model/userImg");
const UserImage = require("../model/userImg");
router.post("/user-image", uploader.single("avatar"), async (req, res) => {
  try {
    const countDocuments = estimatedDocumentCount();
    if (countDocuments > 1) {
      return res.status(400).json({
        success: false,
        message: "limit reached",
      });
    }
    const { public_id, secure_url: url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        transformation: {
          width: 200,
          height: 200,
          gravity: "face",
          crop: "thumb",
        },
      }
    );
    const userAvatar = new UserImage({
      avatar: {
        public_id,
        url,
      },
    });
    await userAvatar.save();
    return res.json({
      success: true,
      message: "Image upploaded succesfully",
      userAvatar,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
});

router.get("/image", async (req, res) => {
  const userImg = await UserImage.find({});
  return res.status(200).json({
    success: true,
    userImg,
  });
});

module.exports = router;
