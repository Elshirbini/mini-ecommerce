import { Injectable, Logger } from '@nestjs/common';
import { Redlock } from '@sesamecare-oss/redlock';
import { RedisService } from './redis.service';

@Injectable()
export class LockService {
  private readonly logger = new Logger(LockService.name);
  private readonly redlock: Redlock;

  constructor(private readonly redis: RedisService) {
    this.redlock = new Redlock([this.redis.getInstance()], {
      retryCount: 3,
      retryDelay: 200,
      retryJitter: 200,
    });
  }

  async withLock<T>(
    key: string,
    ttl: number,
    task: () => Promise<T>,
  ): Promise<T> {
    return this.redlock.using([key], ttl, async () => task());
  }
}
