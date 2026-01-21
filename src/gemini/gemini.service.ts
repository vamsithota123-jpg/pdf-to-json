import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  async extractJson(text: string): Promise<any> {
    const prompt = `
Convert the following sports ranking text into VALID JSON ONLY.

Rules:
- Output JSON only
- No markdown
- No explanations
- Use arrays
- Normalize field names

TEXT:
${text}
`;

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();

    
    const start = responseText.indexOf('{');
    const end = responseText.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('Gemini did not return valid JSON');
    }

    return JSON.parse(responseText.slice(start, end + 1));
  }
}
