import { Module } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { CloudflareResolver } from './cloudflare.resolver';

@Module({
  providers: [CloudflareService, CloudflareResolver],
  exports: [CloudflareService],
})
export class CloudflareModule {}
