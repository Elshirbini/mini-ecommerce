import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { IdempotencyRepository } from './idempotency-key.repository';
import { createHash } from 'crypto';
import { FastifyRequest } from 'fastify';
import { from, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyRepository: IdempotencyRepository) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req: FastifyRequest = context.switchToHttp().getRequest();

    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return next.handle();
      // throw new NotFoundException('Idempotency key not found');
    }

    const requestHash = createHash('sha256')
      .update(JSON.stringify(req.body))
      .digest('hex');

    return from(
      this.idempotencyRepository.findIdempotencyKeyByKey(idempotencyKey),
    ).pipe(
      switchMap((existing) => {
        if (existing) {
          if (existing.requestHash !== requestHash) {
            throw new ConflictException(
              'Idempotency key reused with different payload',
            );
          }

          return of(existing.response);
        }

        return next.handle().pipe(
          tap(async (response) => {
            await this.idempotencyRepository.createIdempotencyKey({
              key: idempotencyKey,
              endpoint: req.url,
              requestHash,
              response,
              statusCode: 200,
            });
          }),
        );
      }),
    );
  }
}
