import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { TURNSTILE_METADATA_KEY } from './turnstile.decorator';
import { TurnstileService } from './turnstile.service';

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly turnstileService: TurnstileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<boolean>(
      TURNSTILE_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Resolver doesn't require Turnstile
    if (!required) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);

    const args = gqlContext.getArgs();

    const token = args?.input?.turnstileToken;

    if (!token) {
      throw new ForbiddenException('Turnstile verification is required');
    }

    const result = await this.turnstileService.verify(token);

    console.log(result);

    if (!result.success) {
      throw new ForbiddenException('Turnstile verification failed');
    }

    return true;
  }
}
