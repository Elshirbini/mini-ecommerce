import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './graphql/auth.type';
import { SignupInput, LoginInput } from './graphql/auth.input';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Turnstile } from 'src/common/security/turnstile/turnstile.decorator';
import { TurnstileGuard } from 'src/common/security/turnstile/turnstile.guard';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { TokenService } from './services/token.service';
import GraphQLUpload, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Mutation(() => AuthPayload)
  async signup(
    @Args(
      'input',
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    input: SignupInput,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file?: FileUpload,
  ): Promise<AuthPayload> {
    return this.authService.signup(input, file);
  }

  // @Turnstile()
  // @UseGuards(TurnstileGuard)
  @Mutation(() => AuthPayload)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: GraphQLContext,
  ): Promise<AuthPayload> {
    const result = await this.authService.login(input);
    this.tokenService.setAuthCookies(
      ctx.reply,
      result.accessToken,
      result.refreshToken,
    );

    return { user: result.user };
  }
}
