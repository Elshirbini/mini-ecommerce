import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { retry } from 'src/utils/retry.util';

interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  'error-codes'?: string[];
}

@Injectable()
export class TurnstileService {
  private readonly verifyUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  constructor() {}

  async verify(
    token: string,
    remoteIp?: string,
  ): Promise<TurnstileVerifyResponse> {
    const body = new URLSearchParams();

    body.append('secret', process.env.TURNSTILE_SECRET_KEY!);
    body.append('response', token);

    if (remoteIp) {
      body.append('remoteip', remoteIp);
    }

    try {
      const response = await retry(
        () =>
          axios.post<TurnstileVerifyResponse>(this.verifyUrl, body, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 5000,
          }),
        3,
      );

      return response.data;
    } catch {
      throw new InternalServerErrorException(
        'Turnstile verification service failed',
      );
    }
  }
}
