import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  /**
   * Generates a public URL for an uploaded file.
   * @param filename The name of the file on disk.
   * @returns The relative public URL of the file.
   */
  getPublicUrl(filename: string): string {
    return `/uploads/images/${filename}`;
  }
}
