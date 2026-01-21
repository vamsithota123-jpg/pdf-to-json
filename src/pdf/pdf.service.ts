import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const pdf = require('pdf-parse');

@Injectable()
export class PdfService {
  async extractText(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;
  }
}
