import { validate } from 'class-validator';
import { CreateUserMedicalPackageDto } from './create-user-medical-package.dto';

describe('CreateUserMedicalPackageDto', () => {
  const validateDto = (paymentScreenshot?: string) => {
    const dto = Object.assign(new CreateUserMedicalPackageDto(), {
      packageId: 'package-id',
      paymentScreenshot,
    });

    return validate(dto);
  };

  it.each([undefined, '', '   '])(
    'rejects a missing or blank payment screenshot (%s)',
    async (paymentScreenshot) => {
      const errors = await validateDto(paymentScreenshot);

      expect(
        errors.some((error) => error.property === 'paymentScreenshot'),
      ).toBe(true);
    },
  );

  it('accepts an uploaded image key', async () => {
    const errors = await validateDto('payment-proof.png');

    expect(errors).toHaveLength(0);
  });
});
