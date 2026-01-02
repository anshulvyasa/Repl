import cloudinary from "../../lib/cloudinary/cloudinary";
import { Request, Response } from "express";
import { prisma } from "@repo/db/jsclient";


type Body = {
    photo: string
}

// the user posts an image form their device
export async function POSTimage(req: Request, res: Response) {
    try {
        const body = req.body as Body  //coming from frontend

        if (!body.photo || !req.user?.id) {
            return res.status(400).json({ success: false, error: "Photo required" });
        }

        const base64Image = body.photo.split(',')[1];//To get the base64 part only
        const photoUrl = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${base64Image}`,
            { folder: "profile" }
        ) //GETTING THE CLOUDINARY OPTIMISED URL

        const newPic = await prisma.user.update({
            where: { id: req.user?.id },
            data: {
                image: photoUrl.secure_url
            }
        })
        // console.log("These are the post errors", newPic);
        return res.status(201).json({ success: true, data: photoUrl });

    } catch (error) {
        console.error('Error creating post:', error); // Log the error
        res.status(500).json({ success: false, error: "Error while getting image URL from cloudinary  or posting the image to the backend" });
    }
}
