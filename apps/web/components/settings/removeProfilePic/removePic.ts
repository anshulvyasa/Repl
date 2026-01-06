"use server"
import getUserInfo from "@/lib/get_user"
import { prisma } from "@repo/db";

export async function removePic() {
    try {

        const user = await getUserInfo()
    

        if (!user) {
            throw new Error("User not authenticated")
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                image: null,
            },
        })

        return updatedUser

    } catch (error) {
        console.log(error,"Error while deleting ")
    }



}