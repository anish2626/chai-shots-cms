import { Controller, Get, Param, Query, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('programs')
async listPrograms(
  @Res() res: Response,
  @Query('language') language: string,
  @Query('cursor') cursor?: string,
  @Query('limit') limit = '10',
) {
  const take = Number(limit);

  const programs = await this.prisma.program.findMany({
    where: {
      status: 'published',
      ...(language && { languagePrimary: language }),
      terms: {
        some: {
          lessons: {
            some: { status: 'published' },
          },
        },
      },
    },
    include: {
      assets: true,
    },
    orderBy: { publishedAt: 'desc' },
    take,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  res.setHeader('Cache-Control', 'public, max-age=60');

  return res.json({
    data: programs.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      languagePrimary: p.languagePrimary,
      languagesAvailable: p.languagesAvailable,
      publishedAt: p.publishedAt,
      assets: {
        posters: groupAssets(p.assets),
      },
    })),
    nextCursor: programs.length ? programs[programs.length - 1].id : null,
  });
}

@Get('programs/:id')
async getProgram(@Param('id') id: string, @Res() res: Response) {
  const program = await this.prisma.program.findFirst({
    where: {
      id,
      status: 'published',
    },
    include: {
      assets: true,
      terms: {
        orderBy: { termNumber: 'asc' },
        include: {
          lessons: {
            where: { status: 'published' },
            orderBy: { lessonNumber: 'asc' },
            include: { assets: true },
          },
        },
      },
    },
  });

  if (!program) throw new NotFoundException('Program not found');

  res.setHeader('Cache-Control', 'public, max-age=60');

  return res.json({
    id: program.id,
    title: program.title,
    description: program.description,
    languagePrimary: program.languagePrimary,
    languagesAvailable: program.languagesAvailable,
    publishedAt: program.publishedAt,
    assets: {
      posters: groupAssets(program.assets),
    },
    terms: program.terms.map((t) => ({
      id: t.id,
      termNumber: t.termNumber,
      title: t.title,
      lessons: t.lessons.map((l) => ({
        id: l.id,
        lessonNumber: l.lessonNumber,
        title: l.title,
        contentType: l.contentType,
        durationMs: l.durationMs,
        isPaid: l.isPaid,
        assets: {
          thumbnails: groupAssets(l.assets),
        },
      })),
    })),
  });
}

@Get('lessons/:id')
async getLesson(@Param('id') id: string, @Res() res: Response) {
  const lesson = await this.prisma.lesson.findFirst({
    where: {
      id,
      status: 'published',
    },
    include: {
      assets: true,
    },
  });

  if (!lesson) throw new NotFoundException('Lesson not found');

  res.setHeader('Cache-Control', 'public, max-age=60');

  return res.json({
    id: lesson.id,
    title: lesson.title,
    contentType: lesson.contentType,
    durationMs: lesson.durationMs,
    isPaid: lesson.isPaid,
    contentLanguagePrimary: lesson.contentLanguagePrimary,
    contentLanguagesAvailable: lesson.contentLanguagesAvailable,
    contentUrlsByLanguage: lesson.contentUrlsByLanguage,
    assets: {
      thumbnails: groupAssets(lesson.assets),
    },
    publishedAt: lesson.publishedAt,
  });
}


}

function groupAssets(assets: any[]) {
  const result = {};
  for (const asset of assets) {
    if (!result[asset.language]) result[asset.language] = {};
    result[asset.language][asset.variant] = asset.url;
  }
  return result;
}
