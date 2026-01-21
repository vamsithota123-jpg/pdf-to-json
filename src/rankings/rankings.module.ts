import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { Ranking, RankingSchema } from './schemas/rankings.schema';
import { PdfService } from '../pdf/pdf.service';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ranking.name, schema: RankingSchema },
    ]),
  ],
  controllers: [RankingsController],
  providers: [RankingsService, PdfService, GeminiService],
})
export class RankingsModule {}
