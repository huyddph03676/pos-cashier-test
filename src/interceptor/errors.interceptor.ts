import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const response = err.response || err;
        return throwError(
          () =>
            new HttpException(
              {
                success: false,
                message: response.message,
              },
              response.statusCode,
            ),
        );
      }),
    );
  }
}
