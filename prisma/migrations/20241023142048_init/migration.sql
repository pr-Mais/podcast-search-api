-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "trackName" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "trackViewUrl" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Search" (
    "id" SERIAL NOT NULL,
    "searchTerm" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchTrack" (
    "searchId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "SearchTrack_pkey" PRIMARY KEY ("searchId","trackId")
);

-- AddForeignKey
ALTER TABLE "SearchTrack" ADD CONSTRAINT "SearchTrack_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "Search"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchTrack" ADD CONSTRAINT "SearchTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
