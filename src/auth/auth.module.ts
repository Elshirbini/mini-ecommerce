import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { TurnstileModule } from 'src/common/security/turnstile/turnstile.module';
import { CommonModule } from 'src/common/common.module';
import { TokenService } from './services/token.service';

@Module({
  imports: [UserModule, TurnstileModule, CommonModule, JwtModule],
  providers: [AuthService, TokenService, AuthResolver],
})
export class AuthModule {}
