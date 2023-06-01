import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { AuthAdminService } from './admin/auth.admin.service';
import { AuthUsersService } from './auth-users.service';
import { EncryptionsService } from './encryptions.service';
import { FirebaseService } from './firebase.service';
import { SignInController } from './sign-in/sign-in.controller';
import { SignInService } from './sign-in/sign-in.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: '60d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [SignInController],
  providers: [
    JwtStrategy,
    SignInService,
    AuthAdminService,
    AuthUsersService,
    EncryptionsService,
    FirebaseService,
  ],
})
export class AuthModule {}
