"use server"

import { auth } from "@/auth";
import { prisma } from "@repo/db";


export const getUserInfo=async()=>{
    const session=await auth();

    if(!session?.user?.id){
        return null;
    }

    const user=await prisma.user.findUnique({
        where:{
            id:session.user.id
        }
    });

    return user;
}