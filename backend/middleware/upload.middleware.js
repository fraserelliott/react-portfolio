const {cloudinary} = require('../config/');
const streamifier = require("streamifier");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({error: "No file provided"});

    const folder = process.env.NODE_ENV === "production"
      ? "portfolio"
      : "portfolio-test"

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder, resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    req.image = {url: result.secure_url, public_id: result.public_id};
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Upload failed"});
  }
}