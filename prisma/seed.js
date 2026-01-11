const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 🔥 CLEAN EXISTING DATA (ORDER MATTERS)
  await prisma.lessonAsset.deleteMany();
  await prisma.programAsset.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.term.deleteMany();
  await prisma.program.deleteMany();
  await prisma.user.deleteMany();

  // =========================
  // PROGRAM + CONTENT SEED
  // =========================

const program = await prisma.program.create({
  data: {
    title: 'AI Foundations',
    description: 'Intro to AI',
    languagePrimary: 'en',
    languagesAvailable: ['en', 'hi'],
    status: 'published',
    publishedAt: new Date(),
  },
});

  await prisma.programAsset.createMany({
    data: [
      {
        programId: program.id,
        language: 'en',
        variant: 'portrait',
        url: 'https://dummyimage.com/300x500',
      },
      {
        programId: program.id,
        language: 'en',
        variant: 'landscape',
        url: 'https://dummyimage.com/500x300',
      },
    ],
  });

  const term = await prisma.term.create({
    data: {
      programId: program.id,
      termNumber: 1,
      title: 'Basics',
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      termId: term.id,
      lessonNumber: 1,
      title: 'What is AI?',
      contentType: 'video',
      durationMs: 600000,
      contentLanguagePrimary: 'en',
      contentLanguagesAvailable: ['en'],
      contentUrlsByLanguage: {
        en: 'https://video.example.com/ai',
      },
      status: 'published',
      publishedAt: new Date(),
    },
  });

  await prisma.lessonAsset.createMany({
    data: [
      {
        lessonId: lesson1.id,
        language: 'en',
        variant: 'portrait',
        url: 'https://dummyimage.com/300x500',
      },
      {
        lessonId: lesson1.id,
        language: 'en',
        variant: 'landscape',
        url: 'https://dummyimage.com/500x300',
      },
    ],
  });

  await prisma.lesson.create({
    data: {
      termId: term.id,
      lessonNumber: 2,
      title: 'History of AI',
      contentType: 'video',
      durationMs: 700000,
      contentLanguagePrimary: 'en',
      contentLanguagesAvailable: ['en'],
      contentUrlsByLanguage: {
        en: 'https://video.example.com/history',
      },
      status: 'scheduled',
      publishAt: new Date(Date.now() + 2 * 60 * 1000), // +2 min
    },
  });

  // =========================
  // USER AUTH SEED (STEP 7.10)
  // =========================

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@cms.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        email: 'editor@cms.com',
        password: hashedPassword,
        role: 'editor',
      },
      {
        email: 'viewer@cms.com',
        password: hashedPassword,
        role: 'viewer',
      },
    ],
  });

  console.log('✅ Database seeded successfully (content + users)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
