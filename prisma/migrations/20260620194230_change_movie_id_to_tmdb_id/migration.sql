/*
  Warnings:

  - You are about to drop the column `movieId` on the `WatchlistItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,tmdbId]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `WatchlistItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbId` to the `WatchlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WatchlistItem" DROP CONSTRAINT "WatchlistItem_movieId_fkey";

-- DropIndex
DROP INDEX "WatchlistItem_userId_movieId_key";

-- AlterTable
ALTER TABLE "WatchlistItem" DROP COLUMN "movieId",
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "tmdbId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_tmdbId_key" ON "WatchlistItem"("userId", "tmdbId");

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_tmdbId_fkey" FOREIGN KEY ("tmdbId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
