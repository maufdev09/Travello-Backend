-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
