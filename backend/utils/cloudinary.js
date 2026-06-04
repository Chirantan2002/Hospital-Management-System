import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// UPLOAD FILE TO CLOUDINARY
export async function uploadToCloudinary(filepath, folder = "doctors") {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder,
      resource_type: "image",
    });

    // remove the local file after upload
    fs.unlinkSync(filepath);

    return result;
  } catch (err) {
    console.error("cloudinary upload error:", err);
    throw err;
  }
}

// DELETE IMAGE FROM CLODINARY
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("cloudinary delete error:", err);
    throw err;
  }
}

export default cloudinary;