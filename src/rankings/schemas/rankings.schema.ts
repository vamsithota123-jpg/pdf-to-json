import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Ranking {
  @Prop()
  source: string;

  @Prop()
  pdfName: string;

  @Prop({ type: Object })
  data: any;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);
