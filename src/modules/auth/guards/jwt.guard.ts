import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AppConfig } from '../../../app.config';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AppConfig.PUBLIC_ENDPOINT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<T extends User>(
    err: unknown,
    user: T,
    info: unknown,
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest();

    if (user) {
      if (req.method === 'POST') {
        req.body.createdBy = user.id;

        req.body.updatedBy = user.id;
      } else if (['PATCH', 'PUT'].includes(req.method)) {
        req.body.updatedBy = user.id;
      }
      return user;
    }

    throw err || new UnauthorizedException();
  }
}
