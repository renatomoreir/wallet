import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../modules/users/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('Token não informado');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      request.user = {
        userId: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      if (!request.user.role) {
        throw new ForbiddenException('Usuário sem função definida');
      }

      if (!requiredRoles.includes(request.user.role)) {
        throw new ForbiddenException('Acesso negado. Permissão insuficiente');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Token inválido');
    }
  }
}
