import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Ranking {
  @Prop({ required: true, unique: true, index: true })
  uid: string;

  @Prop()
  sport: string;

  @Prop()
  event: string;

  @Prop()
  entity: string;

  @Prop()
  source: string;

  @Prop()
  pdfName: string;

  @Prop({ type: Object })
  data: any;
}
export const RankingSchema = SchemaFactory.createForClass(Ranking);

RankingSchema.index({ uid: 1 }, { unique: true });
