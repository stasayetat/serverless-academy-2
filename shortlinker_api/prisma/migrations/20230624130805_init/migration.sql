-- CreateTable
CREATE TABLE "UrlModel" (
    "id" SERIAL NOT NULL,
    "longURL" TEXT NOT NULL,
    "shortURL" TEXT NOT NULL,

    CONSTRAINT "UrlModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlModel_longURL_key" ON "UrlModel"("longURL");
