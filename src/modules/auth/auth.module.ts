import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { AuthAdminService } from './admin/auth.admin.service';
import { AuthSignInController } from './auth-sign-in.controller';
import { AuthSignInService } from './auth-sign-in.service';
import { AuthUsersService } from './auth-users.service';
import { EncryptionsService } from './encryptions.service';
import { FirebaseService } from './firebase.service';
import { JwtStrategy } from './strageties/jwt-auth.strategy';

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
  controllers: [AuthSignInController],
  providers: [
    JwtStrategy,
    AuthSignInService,
    AuthAdminService,
    AuthUsersService,
    EncryptionsService,
    FirebaseService,
  ],
})
export class AuthModule {}
