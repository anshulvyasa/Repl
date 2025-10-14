-- CreateEnum
CREATE TYPE "Category" AS ENUM ('frontend', 'backend', 'fullstack');

-- CreateTable
CREATE TABLE "Templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "popularity" BIGINT NOT NULL,
    "tags" TEXT[],
    "features" TEXT[],
    "category" "Category" NOT NULL,

    CONSTRAINT "Templates_pkey" PRIMARY KEY ("id")
);
