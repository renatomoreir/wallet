import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou não informado');
    }
    if (info && info.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token expirado');
    }
    return user;

  }
}
