import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { jwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private readonly cookiesOptionAccessToken = {
    httpOnly: true,
    secure: true,
    // sameSite: (process.env.NODE_ENV === 'prod' ? 'strict' : 'none') as
    //   | 'lax'
    //   | 'strict'
    //   | 'none',
    sameSite: 'none' as 'lax' | 'strict' | 'none',
    path: '/',
    maxAge: 15 * 60,
  };

  private readonly cookiesOptionRefreshToken = {
    httpOnly: true,
    secure: true,
    // sameSite: (process.env.NODE_ENV === 'prod' ? 'strict' : 'none') as
    //   | 'lax'
    //   | 'strict'
    //   | 'none',
    sameSite: 'none' as 'lax' | 'strict' | 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  };

  generateAccessToken(user: UserDocument) {
    const payload = { id: user._id, role: user.role };
    return this.jwtService.signAsync(payload, {
      secret: this.config.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  generateRefreshToken(user: UserDocument) {
    const payload = { id: user._id, role: user.role };
    return this.jwtService.signAsync(payload, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  setAuthCookies(res: FastifyReply, accessToken: string, refreshToken: string) {
    res.setCookie('accessToken', accessToken, this.cookiesOptionAccessToken);
    res.setCookie('refreshToken', refreshToken, this.cookiesOptionRefreshToken);
  }

  clearAuthCookies(res: FastifyReply) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  verifyRefreshToken(token: string): jwtPayload {
    return this.jwtService.verify(token, {
      secret: this.config.get('REFRESH_TOKEN_SECRET'),
    });
  }

  issueNewAccessTokenFromPayload(payload: jwtPayload) {
    return this.jwtService.sign(
      { id: payload.id, role: payload.role },
      {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
  }
}
