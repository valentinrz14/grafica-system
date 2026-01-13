import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization: string };
      method: string;
      url: string;
    }>();
    const route = `${request.method} ${request.url}`;

    console.log(`JWT Guard: Checking route: ${route}`);

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(`JWT Guard: Route is public, allowing`);
      return true;
    }

    const authHeader = request.headers.authorization;
    console.log(`JWT Guard: Auth header present: ${!!authHeader}`);

    if (authHeader) {
      console.log(
        `JWT Guard: Token starts with: ${authHeader.substring(0, 20)}...`,
      );
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: Error | null,
    user: User,
    info: Error | null,
  ): TUser {
    console.log('JWT Guard: handleRequest called', {
      hasError: !!err,
      hasUser: !!user,
      info: info?.message || info,
      errorMessage: err?.message,
    });

    if (err || !user) {
      console.error('JWT Guard: Authentication failed', {
        error: err?.message,
        info: info?.message || info,
        hasUser: !!user,
      });
      throw err || new UnauthorizedException('Authentication required');
    }

    return user as TUser;
  }
}
