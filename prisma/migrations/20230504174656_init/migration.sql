/*
  Warnings:

  - Added the required column `key` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "description" TEXT,
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "version" TEXT;
