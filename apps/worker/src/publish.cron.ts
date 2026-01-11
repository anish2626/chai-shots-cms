import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from './prisma/prisma.service';


@Injectable()
export class PublishCron {
  private readonly logger = new Logger(PublishCron.name);

  constructor(private readonly prisma: PrismaService) {}

  // Runs every minute
  @Cron('* * * * *')
  async handlePublish() {
    const now = new Date();

    const lessons = await this.prisma.lesson.findMany({
      where: {
        status: 'scheduled',
        publishAt: { lte: now },
      },
      select: {
        id: true,
        termId: true,
      },
      take: 10,
    });

    for (const lesson of lessons) {
      await this.publishLessonSafely(lesson.id);
    }
  }

  private async publishLessonSafely(lessonId: string) {
    await this.prisma.$transaction(async (tx) => {
      // Re-check inside transaction (IDEMPOTENT)
      const lesson = await tx.lesson.findFirst({
        where: {
          id: lessonId,
          status: 'scheduled',
        },
        select: {
          id: true,
          term: { select: { programId: true } },
        },
      });

      if (!lesson) return;

      // Publish lesson
      await tx.lesson.update({
        where: { id: lesson.id },
        data: {
          status: 'published',
          publishedAt: new Date(),
        },
      });

      // Auto-publish program on first lesson
      const publishedCount = await tx.lesson.count({
        where: {
          term: { programId: lesson.term.programId },
          status: 'published',
        },
      });

      if (publishedCount === 1) {
        await tx.program.updateMany({
          where: {
            id: lesson.term.programId,
            status: { not: 'published' },
          },
          data: {
            status: 'published',
            publishedAt: new Date(),
          },
        });
      }
    });

    this.logger.log(`Published lesson ${lessonId}`);
  }
}
