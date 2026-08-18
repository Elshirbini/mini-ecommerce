import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        if (typeof result === 'string') {
          return {
            success: true,
            message: result,
          };
        }

        if (
          result &&
          typeof result === 'object' &&
          ('message' in result || 'data' in result || 'meta' in result)
        ) {
          return {
            success: true,
            ...(result.message && { message: result.message }),
            ...(result.data && { data: result.data }),
            ...(result.meta && { meta: result.meta }),
          } as {
            success: boolean;
            message?: string;
            data?: any;
            meta?: any;
          };
        }

        return {
          success: true,
          data: result,
        };
      }),
    );
  }
}
