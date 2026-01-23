import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RankingsService } from './rankings.service';
import { pdfMulterConfig } from '../common/multer/multer.config';
import { Ranking } from '../rankings/schemas/rankings.schema';

@Controller('rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Post('pdf-upload')
  @UseInterceptors(FilesInterceptor('files', 10, pdfMulterConfig))
  async uploadPdf(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('source') source: string,
  ) {
    const results: Ranking[] = [];

    for (const file of files) {
      results.push(
        ...(await this.rankingsService.processPdf(file, source)),
      );
    }

    return results;
  }
}
