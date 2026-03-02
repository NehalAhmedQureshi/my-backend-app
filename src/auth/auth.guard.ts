import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Get the 'Authorization' header (looks like: Bearer eyJhbGci...)
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No ticket, no entry!');
    }

    const token = authHeader.split(' ')[1]; // Split "Bearer" and the actual "token"

    try {
      // 2. Check if the "Stamp" is real using your Secret Key
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'MY_SECRET_STAMP_123', // Use the SAME key you used in AuthModule
      });

      // 3. Attach user info to the request so the Controller knows who this is
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('That ticket is fake or expired!');
    }

    return true; // Let them in!
  }
}
