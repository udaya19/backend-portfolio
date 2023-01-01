const { isAuthenticated } = require("../middlewares/auth");

const router = require("express").Router();
const cloudinary = require("cloudinary").v2;

const config = "../config";
const hashPassword = require(`${config}/hash_password`);
const comparePassword = require(`${config}/comparePassword`);
const generateToken = require(`${config}/jwtToken`);
const uploader = require(`${config}/multer`);

const model = "../model";
const User = require(`${model}/user`);
const UserImage = require(`${model}/userImg`);
const { estimatedDocumentCount } = require(`${model}/userImg`);

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
  try {
    const userImg = await UserImage.find({});
    return res.status(200).json({
      success: true,
      userImg,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
});

router.post("/new-user", uploader.none(), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const encryptedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      password: encryptedPassword,
    });
    await newUser.save();
    return res.status(200).json({
      success: true,
      newUser,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/login", uploader.none(), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Invalid email/password",
      });
    }
    const isSame = await comparePassword(password, user.password);
    if (!isSame) {
      return res.status(404).json({
        success: false,
        error: "Invalid email/password",
      });
    }
    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Login succesfull",
      user,
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/profile", isAuthenticated, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
