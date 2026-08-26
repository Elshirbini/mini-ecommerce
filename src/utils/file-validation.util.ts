import { DiskStorageFile } from '@blazity/nest-file-fastify';
import { BadRequestException } from '@nestjs/common';
import * as FileType from 'file-type';

interface ValidateFileOptions {
  allowedMimeTypes: string[];
  maxSizeInMB?: number;
}

export interface FilesValidationOptions {
  thumbnail?: ValidateFileOptions;
  images?: ValidateFileOptions;
}

export async function validateUploadedFile(
  buffer: Buffer,
  options: ValidateFileOptions,
  fieldName: string,
) {
  if (!buffer) {
    throw new BadRequestException(`الملف ${fieldName} غير موجود`);
  }

  const maxSizeInBytes = (options.maxSizeInMB ?? 5) * 1024 * 1024;
  if (buffer.length > maxSizeInBytes) {
    throw new BadRequestException(
      `حجم الملف ${fieldName} كبير، الحد الأقصى ${options.maxSizeInMB ?? 5}MB`,
    );
  }

  const fileType = await FileType.fileTypeFromBuffer(buffer);

  if (!fileType || !options.allowedMimeTypes.includes(fileType.mime)) {
    throw new BadRequestException(
      `نوع الملف ${fieldName} غير مسموح به: ${fileType?.mime}`,
    );
  }
  return fileType;
}

export async function validateUploadedFileDisk(
  file: DiskStorageFile,
  options: ValidateFileOptions,
) {
  const maxSizeInBytes = (options.maxSizeInMB ?? 5) * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new BadRequestException(
      `حجم الملف ${file.fieldname} كبير، الحد الأقصى ${options.maxSizeInMB ?? 5}MB`,
    );
  }

  const fileType = await FileType.fileTypeFromFile(file.path);

  if (!fileType || !options.allowedMimeTypes.includes(fileType.mime)) {
    throw new BadRequestException(
      `نوع الملف ${file.fieldname} غير مسموح به: ${fileType?.mime}`,
    );
  }
}
