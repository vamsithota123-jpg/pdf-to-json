import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RankingsModule } from './rankings/rankings.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RankingsModule,
  ],
})
export class AppModule {}
