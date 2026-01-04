import { uploadToCloudinary } from "../../lib/cloudinary/cloudinary"
import { Request, Response } from "express"
import { prisma } from "@repo/db/jsclient"
import fs from "fs/promises"

export async function POSTimage(req: Request, res: Response) {
    try {
        const file = req.file
        const userId = req.body.userId

        if (!file || !userId) {
            return res.status(400).json({
                success: false,
                message: "Missing file or userId",
            })
        }

        const response = await uploadToCloudinary(file.path)

        if (!response?.secure_url) {
            return res.status(502).json({
                success: false,
                message: "Error uploading image to Cloudinary",
            })
        }

        await prisma.user.update({
            where: { id: userId },
            data: { image: response.secure_url },
        })

        // File cleanup is handled by uploadToCloudinary

        return res.status(201).json({
            success: true,
            imageUrl: response.secure_url,
        })
    } catch (error) {
        console.error("error while uploading the image", error)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}
