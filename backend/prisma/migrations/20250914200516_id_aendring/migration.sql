/*
  Warnings:

  - You are about to drop the column `userID` on the `Tool` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Tool" DROP CONSTRAINT "Tool_userID_fkey";

-- AlterTable
ALTER TABLE "public"."Tool" DROP COLUMN "userID",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Tool" ADD CONSTRAINT "Tool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
