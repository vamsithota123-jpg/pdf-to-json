import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ranking } from './schemas/rankings.schema';
import { PdfService } from '../pdf/pdf.service';
import { ExtractJsonFromPdfService } from 'src/pdf/extractJsonFromPdf.service';

/**
 * Normalize strings for stable IDs
 */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Build GLOBAL unique identifier for Olympic rankings
 */
function buildRankingUID(params: {
  sport: string;
  event: string;
  entity: string;
  source: string;
}) {
  return [
    normalize(params.sport),
    normalize(params.event),
    normalize(params.entity),
    normalize(params.source),
  ].join('::');
}

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel(Ranking.name)
    private readonly rankingModel: Model<Ranking>,
    private readonly pdfService: PdfService,
    private readonly extractJsonFromPdfService: ExtractJsonFromPdfService,
  ) {}

  async processPdf(
    file: Express.Multer.File,
    source: string,
  ): Promise<any[]> {

    // 1️⃣ Extract raw text from PDF
    const text = await this.pdfService.extractText(file.path);

    // 2️⃣ Extract structured JSON via Gemini
    /**
     * EXPECTED JSON FORMAT:
     * {
     *   "sport": "Athletics",
     *   "event": "Men's 100m",
     *   "rankings": [
     *     { "rank": 1, "name": "Noah Lyles", "country": "USA", "points": 1450 }
     *   ]
     * }
     */
    const extractedJson =
      await this.extractJsonFromPdfService.extractJsonFromPDF(
        file.path,
        `
Return VALID JSON only with:
- sport
- event
- rankings[] (rank, name, country, points)
No explanation.
        `,
      );

    if (
      !extractedJson?.sport ||
      !extractedJson?.event ||
      !Array.isArray(extractedJson.rankings)
    ) {
      throw new Error('Invalid JSON structure from Gemini');
    }

    const savedRecords: Ranking[] = [];

    // 3️⃣ Store each ranking with UNIQUE UID
    for (const item of extractedJson.rankings) {
      if (!item?.name) continue;

      const uid = buildRankingUID({
        sport: extractedJson.sport,
        event: extractedJson.event,
        entity: item.name,
        source,
      });

      const record = await this.rankingModel.findOneAndUpdate(
        { uid },
        {
          uid,
          sport: extractedJson.sport,
          event: extractedJson.event,
          entity: item.name,
          source,
          pdfName: file.originalname,
          data: item,
        },
        {
          upsert: true,
          new: true,
        },
      );

      savedRecords.push(record);
    }

    return savedRecords;
  }
}
