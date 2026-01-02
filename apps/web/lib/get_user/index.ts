"use server"

import { auth } from "@/auth";
import { prisma } from "@repo/db";


export default async function getUserInfo(){
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
    // this contain the whole info about the user (head to toe)
}