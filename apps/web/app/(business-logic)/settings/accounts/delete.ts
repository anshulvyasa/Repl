"use server"

import { getUserInfo } from "@/lib/get_user";
import { prisma } from "@repo/db";


export async function finalDelete() {
 
  const user = await getUserInfo();

  
  if (!user?.id) {
    throw new Error("No authenticated user found");
  }

  const userId = user.id;

 
  await prisma.$transaction(async (tx) => {
   
    await tx.starMark.deleteMany({
      where: { userId }
    });

    
    await tx.templateFile.deleteMany({
      where: {
        playground: {
          userId
        }
      }
    });

   
    await tx.playground.deleteMany({
      where: { userId }
    });

    await tx.authenticator.deleteMany({
      where: { userId }
    });

    await tx.session.deleteMany({
      where: { userId }
    });

   
    await tx.account.deleteMany({
      where: { userId }
    });


    await tx.user.delete({
      where: { id: userId }
    });
  });

  return { success: true, deletedUserId: userId };
}