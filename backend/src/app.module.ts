import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { PlaceModule } from './place/place.module';
import { TrendingPlaceModule } from './trending-place/trending-place.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
    }),
    AuthModule,
    PlaceModule,
    TrendingPlaceModule,
    UserModule,
  ],
})
export class AppModule {}
