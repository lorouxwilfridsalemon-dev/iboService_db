import { Injectable, NestInterceptor,  ExecutionContext, HttpException, HttpStatus, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
    intercept( context: ExecutionContext,  next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(err => {
                return throwError(new HttpException(err.message, err.statusCode | HttpStatus.INTERNAL_SERVER_ERROR ))
            }),
        );
    }
}