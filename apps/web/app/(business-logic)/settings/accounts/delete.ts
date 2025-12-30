import { getUserInfo } from "@/lib/get_user";
import { prisma } from "@repo/db";


export async function finalDelete() {
  // Get the current user
  const user = await getUserInfo();

  // Guard clause: ensure user exists
  if (!user?.id) {
    throw new Error("No authenticated user found");
  }

  const userId = user.id;

  // Use a transaction to ensure all-or-nothing deletion
  await prisma.$transaction(async (tx) => {
    // 1. Delete StarMarks (references User and Playground)
    await tx.starMark.deleteMany({
      where: { userId }
    });

    // 2. Delete TemplateFiles associated with user's playgrounds
    await tx.templateFile.deleteMany({
      where: {
        playground: {
          userId
        }
      }
    });

    // 3. Delete Playgrounds
    await tx.playground.deleteMany({
      where: { userId }
    });

    // 4. Delete Authenticators (has CASCADE, but being explicit)
    await tx.authenticator.deleteMany({
      where: { userId }
    });

    // 5. Delete Sessions (has CASCADE, but being explicit)
    await tx.session.deleteMany({
      where: { userId }
    });

    // 6. Delete Accounts (has CASCADE, but being explicit)
    await tx.account.deleteMany({
      where: { userId }
    });

    // 7. Finally, delete the User
    await tx.user.delete({
      where: { id: userId }
    });
  });

  return { success: true, deletedUserId: userId };
}