import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ranking } from './schemas/rankings.schema';
import { PdfService } from '../pdf/pdf.service';
import { GeminiService } from '../gemini/gemini.service';
import { ExtractJsonFromPdfService } from 'src/pdf/extractJsonFromPdf.service';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel(Ranking.name)
    private readonly rankingModel: Model<Ranking>,
    private readonly pdfService: PdfService,
    private readonly geminiService: GeminiService,
    private readonly extractJsonFromPdfService: ExtractJsonFromPdfService,
  ) {}

  
  async processPdf(
    file: Express.Multer.File,
    source: string,
  ): Promise<any> {
    const text = await this.pdfService.extractText(file.path);
    const jsonData = await this.extractJsonFromPdfService.extractJsonFromPDF(file.path, text);

    // return this.rankingModel.create({
    //   source,
    //   pdfName: file.originalname,
    //   data: jsonData,
    // });
    return jsonData;
  }
}
