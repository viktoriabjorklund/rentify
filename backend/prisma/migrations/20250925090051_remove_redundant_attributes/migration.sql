/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Request" DROP CONSTRAINT "Request_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Request" DROP COLUMN "ownerId";
