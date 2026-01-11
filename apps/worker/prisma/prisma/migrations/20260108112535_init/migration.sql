-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- CreateEnum
CREATE TYPE "Variant" AS ENUM ('portrait', 'landscape', 'square', 'banner');

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "languagePrimary" TEXT NOT NULL,
    "languagesAvailable" TEXT[],
    "status" "ProgramStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "termNumber" INTEGER NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "termId" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "durationMs" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "contentLanguagePrimary" TEXT NOT NULL,
    "contentLanguagesAvailable" TEXT[],
    "contentUrlsByLanguage" JSONB NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'draft',
    "publishAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramAsset" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "variant" "Variant" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProgramAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonAsset" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "variant" "Variant" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "LessonAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Program_status_languagePrimary_publishedAt_idx" ON "Program"("status", "languagePrimary", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Term_programId_termNumber_key" ON "Term"("programId", "termNumber");

-- CreateIndex
CREATE INDEX "Lesson_status_publishAt_idx" ON "Lesson"("status", "publishAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_termId_lessonNumber_key" ON "Lesson"("termId", "lessonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramAsset_programId_language_variant_key" ON "ProgramAsset"("programId", "language", "variant");

-- CreateIndex
CREATE UNIQUE INDEX "LessonAsset_lessonId_language_variant_key" ON "LessonAsset"("lessonId", "language", "variant");

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramAsset" ADD CONSTRAINT "ProgramAsset_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonAsset" ADD CONSTRAINT "LessonAsset_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
