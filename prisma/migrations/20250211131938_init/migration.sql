-- CreateTable
CREATE TABLE "ClassSession" (
    "id" SERIAL NOT NULL,
    "teacher" TEXT NOT NULL,
    "classname" TEXT NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "endDatetime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id")
);
