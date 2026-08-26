import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignupInput, LoginInput } from './graphql/auth.input';
import { AuthPayload } from './graphql/auth.type';
import { UserRole } from 'src/user/enums/userRole.enum';
import { TokenService } from './services/token.service';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import { validateUploadedFile } from 'src/utils/file-validation.util';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly cloudflareR2: CloudflareService,
  ) {}

  async signup(input: SignupInput, file?: FileUpload): Promise<AuthPayload> {
    let imageKey: string | undefined;
    let imageUrl: string | undefined;

    const existingUser = await this.userService.findByEmail(input.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    if (file) {
      const upload = file;

      this.logger.log('FILE RECEIVED');
      this.logger.log({
        filename: upload.filename,
        mimetype: upload.mimetype,
        encoding: upload.encoding,
      });

      const stream = upload.createReadStream();

      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);

      const result = await validateUploadedFile(
        buffer,
        {
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
          maxSizeInMB: 5,
        },
        upload.filename,
      );

      const { url, key } = await this.cloudflareR2.uploadFileS3(
        buffer,
        `profile-pictures/${input.email}`,
        result.mime,
      );

      imageKey = key;
      imageUrl = url;
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.userService.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: UserRole.USER,
      imageKey,
      imageUrl,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      },
    };
  }

  async login(input: LoginInput): Promise<
    AuthPayload & {
      accessToken: string;
      refreshToken: string;
    }
  > {
    const user = await this.userService.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
