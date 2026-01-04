import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Debug: Check if env vars are loaded
console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✓ SET" : "✗ MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ SET" : "✗ MISSING",
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(localFilePath: string) {
  try {
    if (!localFilePath) return null

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })


    fs.unlinkSync(localFilePath)

    return response
  } catch (error) {

    if (localFilePath) {
      fs.unlinkSync(localFilePath)
    }

    console.error("Cloudinary upload failed", error)
    return null
  }
}
