import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CloudflareService } from './cloudflare.service';
import { GeneratePresignedUrlInput } from './graphql/generatePresignedUel.input';
import { PresignedUrlResponse } from './graphql/presignedUrlRespoinse.type';

@Resolver()
export class CloudflareResolver {
  constructor(private readonly cloudflareService: CloudflareService) {}
  // Define your resolver methods here

  @Mutation(() => PresignedUrlResponse)
  async generatePresignedUrl(@Args('input') input: GeneratePresignedUrlInput) {
    return this.cloudflareService.generatePresignedUrl(
      input.key,
      input.mimetype,
      input.expiresIn,
      input.metaData || {},
    );
  }
}
