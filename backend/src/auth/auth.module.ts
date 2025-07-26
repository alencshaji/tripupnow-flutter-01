// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from '../schemas/refreshToken.schema';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { EmailService } from '../common/services/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // required for JwtModule.registerAsync
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'defaultSecretKey'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
