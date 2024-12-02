import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AccessKeyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const accessKey = request.headers['access-key'];

    if (!accessKey || request.headers['access-key'] !== '123') {
      throw new HttpException('Invalid access key ', HttpStatus.UNAUTHORIZED);
    }

    return next.handle();
  }
}
