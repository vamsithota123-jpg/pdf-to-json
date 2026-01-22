import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async extractJsonFromPDF(
    pdfFilePath: string,
    prompt: string,
  ): Promise<any> {
    try {
      const pdfBuffer = fs.readFileSync(pdfFilePath);
      const base64Pdf = pdfBuffer.toString('base64');

      const contents = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64Pdf,
          },
        },
        { text: prompt },
      ];

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini PDF extract error:', error);
      throw new InternalServerErrorException(
        'Failed to extract JSON from PDF',
      );
    }
  }
}