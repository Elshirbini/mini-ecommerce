import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { Readable } from 'stream';
import { r2Config } from './cloudflare.config';
import { DiskStorageFile } from '@blazity/nest-file-fastify';
import fs from 'fs';
import { extension } from 'mime-types';

@Injectable()
export class CloudflareService {
  private logger = new Logger(CloudflareService.name);
  constructor() {}
  private readonly s3 = new S3Client({
    region: r2Config.region,
    endpoint: r2Config.endpoint,
    credentials: r2Config.credentials,
    forcePathStyle: true,
  });

  async uploadFileS3(
    file: Buffer | Readable,
    key: string,
    mimetype: string,
    fileSize?: number,
  ) {
    const ext = extension(mimetype) || 'bin';

    const fileKey = `${key}.${ext}`;

    const params = {
      Bucket: r2Config.bucket,
      Key: fileKey || key,
      Body: file,
      ContentType: mimetype,
      ContentLength: Buffer.isBuffer(file) ? file.length : fileSize,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));

      const url = `${r2Config.R2_PUBLIC_DOMAIN}/${fileKey || key}`;

      return {
        url,
        key: fileKey || key,
      };
    } catch (error) {
      this.logger.error('Error in uploading image to s3');
      this.logger.error(error);
      throw new InternalServerErrorException('Error in uploading file');
    }
  }

  async uploadFromDisk(file: DiskStorageFile, key: string) {
    const stream = fs.createReadStream(file.path);

    return this.uploadFileS3(stream, key, file.mimetype, file.size);
  }

  async deleteFileS3(key: string) {
    const params = {
      Key: key,
      Bucket: r2Config.bucket,
    };
    try {
      await this.s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      this.logger.error('Error in deleting file from S3', error);
      throw new InternalServerErrorException('Error in deleting file');
    }
  }

  async getFileStream(key: string): Promise<{
    body: Readable;
    contentType: string | undefined;
    contentLength: number | undefined;
  }> {
    try {
      const response = await this.s3.send(
        new GetObjectCommand({ Bucket: r2Config.bucket, Key: key }),
      );

      if (!response.Body) throw new NotFoundException('File not found');

      return {
        body: response.Body as Readable,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error('Error fetching file from S3', error);
      throw new NotFoundException('File not found');
    }
  }

  async deleteFilesBulkS3(keys: string[]): Promise<void> {
    if (!keys.length) return;

    const BATCH_SIZE = 1000;
    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batch = keys.slice(i, i + BATCH_SIZE);
      try {
        await this.s3.send(
          new DeleteObjectsCommand({
            Bucket: r2Config.bucket,
            Delete: { Objects: batch.map((Key) => ({ Key })) },
          }),
        );
      } catch (error) {
        this.logger.error('Error in bulk deleting files from S3', error);
      }
    }
  }
}
