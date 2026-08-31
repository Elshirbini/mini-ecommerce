import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { AddProductInput } from './graphql/addProduct.input';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { ImageProcessorService } from 'src/common/image/image-processor.service';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { join } from 'path';
import { stat, unlink } from 'fs/promises';
import { validateUploadedFileDisk } from 'src/utils/file-validation.util';
import { Mapper } from '@automapper/core';
import { Product as MongoProduct } from './schemas/product.schema';
import { Product as GraphQLProduct } from './graphql/product.type';
import { DiskStorageFile } from '@blazity/nest-file-fastify';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class ProductService {
  logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageProcessor: ImageProcessorService,
    private readonly cloudflareR2: CloudflareService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async addProduct(
    productData: AddProductInput,
    thumbnail?: Promise<FileUpload>,
    images?: Promise<FileUpload>[],
  ) {
    let thumbnailObj: { imageKey: string; imageUrl: string } | undefined;
    const imagesArr: { imageKey: string; imageUrl: string }[] = [];

    if (thumbnail) {
      const upload = await thumbnail;
      const stream = upload.createReadStream();
      const result = this.imageProcessor.processStream(stream, {
        quality: 80,
        format: 'webp',
      });

      const chunks: Buffer[] = [];

      for await (const chunk of result.stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);

      const { key, url } = await this.cloudflareR2.uploadFileS3(
        buffer,
        `products/thumbnails/${Date.now()}`,
        result.mimeType,
      );

      thumbnailObj = {
        imageKey: key,
        imageUrl: url,
      };
    }

    if (images) {
      const awaitedImages = await Promise.all(images);
      for (const image of awaitedImages) {
        const filename = crypto.randomUUID();
        const dest = join(process.cwd(), 'temp');
        const path = join(dest, filename);
        try {
          await pipeline(image.createReadStream(), createWriteStream(path));

          const fileOnDisk: DiskStorageFile = {
            fieldname: image.filename,
            originalFilename: image.filename,
            encoding: image.encoding,
            mimetype: image.mimetype,
            size: (await stat(path)).size,

            dest,
            filename,
            path,
          };

          await validateUploadedFileDisk(fileOnDisk, {
            maxSizeInMB: 5,
            allowedMimeTypes: ['image/jpeg', 'image/png'],
          });

          const { key, url } = await this.cloudflareR2.uploadFromDisk(
            fileOnDisk,
            `products/images/${Date.now()}-${crypto.randomUUID()}`,
          );

          imagesArr.push({ imageKey: key, imageUrl: url });
        } catch (error) {
          throw new InternalServerErrorException(error);
        } finally {
          if (path) {
            await unlink(path);
          }
        }
      }
    }

    const product = await this.productRepository.createProduct({
      ...productData,
      images: imagesArr,
      thumbnail: thumbnailObj,
    });

    return this.mapper.map(product, MongoProduct, GraphQLProduct);
  }
}
