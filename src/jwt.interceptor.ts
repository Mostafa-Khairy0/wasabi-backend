import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  private publics: string[] = ['/auth'];
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  private isPublic(path: string) {
    for (const index in this.publics)
      if (path.includes(this.publics[index])) return true;
    return false;
  }
  private setToken() {
    return map(async (data: any) => {
      if (data?.user) {
        const { user }: { user: any } = data;
        delete data.user;
        data.token = await this.generateToken(user);
      }
      console.log({ data });
      return data;
    });
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path: string = request?.path;
    if (this.isPublic(path)) return next.handle().pipe(this.setToken());

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid');
    }

    return next.handle().pipe(this.setToken());
  }
  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
  private async generateToken(payload: object): Promise<string> {
    return this.jwtService.sign(payload);
  }
}
