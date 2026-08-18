import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TurnstileGuard } from './turnstile.guard';
import { TurnstileService } from './turnstile.service';

@Module({
  imports: [ConfigModule],
  providers: [TurnstileService, TurnstileGuard],
  exports: [TurnstileService, TurnstileGuard],
})
export class TurnstileModule {}
