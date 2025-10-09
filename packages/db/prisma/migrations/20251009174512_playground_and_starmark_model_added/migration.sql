-- CreateEnum
CREATE TYPE "Template" AS ENUM ('REACT', 'NEXT', 'EXPRESS', 'ANGULAR', 'VUE', 'HONO');

-- CreateTable
CREATE TABLE "Playground" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "template" "Template" NOT NULL DEFAULT 'REACT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Playground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarMark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playgroundId" TEXT NOT NULL,
    "isMarked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarMark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StarMark_userId_playgroundId_key" ON "StarMark"("userId", "playgroundId");

-- AddForeignKey
ALTER TABLE "Playground" ADD CONSTRAINT "Playground_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarMark" ADD CONSTRAINT "StarMark_playgroundId_fkey" FOREIGN KEY ("playgroundId") REFERENCES "Playground"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarMark" ADD CONSTRAINT "StarMark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
