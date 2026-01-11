import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './jwt.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule, // ✅ REQUIRED for AuthGuard('jwt')
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // ✅ REGISTER STRATEGY
  ],
  exports: [JwtModule], // optional but good practice
})
export class AuthModule {}
