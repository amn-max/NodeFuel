-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" BIGINT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
