import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { PublishCron } from './publish.cron';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
  ],
  providers: [PublishCron],
})
export class AppModule {}
