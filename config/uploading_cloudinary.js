const cloudinary = require("cloudinary").v2;

exports.addImage = async (filePath) => {
  const { public_id, secure_url } = await cloudinary.uploader.upload(filePath);
  return {
    public_id,
    secure_url,
  };
};

exports.destroyImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
