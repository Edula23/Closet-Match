-- CreateTable
CREATE TABLE "Outfit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "closetIds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "Outfit_userId_idx" ON "Outfit"("userId");
-- AddForeignKey
ALTER TABLE "Outfit"
ADD CONSTRAINT "Outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;