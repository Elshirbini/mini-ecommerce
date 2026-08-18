import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import sharp, { Sharp } from 'sharp';

import {
  ProcessImageBufferResponse,
  ProcessImageOptions,
  ProcessImageStreamResponse,
} from './image.types';

@Injectable()
export class ImageProcessorService {
  async processBuffer(
    buffer: Buffer,
    options: ProcessImageOptions,
  ): Promise<ProcessImageBufferResponse> {
    const transformer = this.createTransformer(options);

    const output = await sharp(buffer).pipe(transformer).toBuffer();

    return {
      buffer: output,
      extension: this.getExtension(options.format),
      mimeType: this.getMimeType(options.format),
    };
  }

  processStream(
    stream: Readable,
    options: ProcessImageOptions,
  ): ProcessImageStreamResponse {
    const transformer = this.createTransformer(options);

    return {
      stream: stream.pipe(transformer),
      extension: this.getExtension(options.format),
      mimeType: this.getMimeType(options.format),
    };
  }

  processFile(
    path: string,
    options: ProcessImageOptions,
  ): ProcessImageStreamResponse {
    return this.processStream(fs.createReadStream(path), options);
  }

  private createTransformer(options: ProcessImageOptions): Sharp {
    const transformer = sharp();

    if (options.resize) {
      transformer.resize({
        width: options.resize.width,
        height: options.resize.height,
        fit: options.resize.fit,
        withoutEnlargement: options.resize.withoutEnlargement,
      });
    }

    const quality = options.quality ?? 80;

    switch (options.format ?? 'webp') {
      case 'jpeg':
        transformer.jpeg({ quality });
        break;

      case 'png':
        transformer.png();
        break;

      case 'avif':
        transformer.avif({ quality });
        break;

      default:
        transformer.webp({ quality });
        break;
    }

    return transformer;
  }

  private getExtension(format?: string) {
    switch (format ?? 'webp') {
      case 'jpeg':
        return 'jpg';
      case 'png':
        return 'png';
      case 'avif':
        return 'avif';
      default:
        return 'webp';
    }
  }

  private getMimeType(format?: string) {
    switch (format ?? 'webp') {
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'avif':
        return 'image/avif';
      default:
        return 'image/webp';
    }
  }
}
