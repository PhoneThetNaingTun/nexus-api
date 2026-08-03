import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  /**
   * Reduces an uploaded image value to the filename stored on disk.
   * This also keeps create/update requests from persisting a public origin.
   */
  getImageKey(image?: string): string | undefined {
    const value = image?.trim();
    if (!value) return undefined;

    const path = value.split(/[?#]/, 1)[0].replace(/\\/g, '/');
    return path.split('/').filter(Boolean).at(-1);
  }
}
