import { Readable } from 'node:stream';
import { ResizeOptions } from 'sharp';

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  fit?: ResizeOptions['fit'];
  withoutEnlargement?: boolean;
}

export interface ProcessImageOptions {
  resize?: ImageResizeOptions;

  quality?: number;

  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

export interface ProcessImageBufferResponse {
  buffer: Buffer;
  mimeType: string;
  extension: string;
}

export interface ProcessImageStreamResponse {
  stream: Readable;
  mimeType: string;
  extension: string;
}
