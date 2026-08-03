import { describe, expect, it } from '@jest/globals';
import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  const service = new UploadsService();

  describe('getImageKey', () => {
    it.each([
      ['doctor.jpg', 'doctor.jpg'],
      ['/uploads/images/doctor.jpg', 'doctor.jpg'],
      ['https://api.example.com/uploads/images/doctor.jpg', 'doctor.jpg'],
      [
        'https://api.example.com/uploads/images/doctor.jpg?version=1',
        'doctor.jpg',
      ],
    ])('normalizes %s to %s', (image, expected) => {
      expect(service.getImageKey(image)).toBe(expected);
    });

    it.each([undefined, '', '   '])('returns undefined for %s', (image) => {
      expect(service.getImageKey(image)).toBeUndefined();
    });
  });
});
