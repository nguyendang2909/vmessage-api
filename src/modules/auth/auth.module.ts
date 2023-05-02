import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { AuthAdminService } from './admin/auth.admin.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUsersService } from './auth-users.service';
import { EncryptionsService } from './encryptions.service';
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
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    AuthAdminService,
    AuthUsersService,
    EncryptionsService,
  ],
})
export class AuthModule {}