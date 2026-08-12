import { DoctorsService } from './doctors.service';

describe('DoctorsService', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  let service: DoctorsService;

  beforeEach(() => {
    jest.clearAllMocks();
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);

    service = new DoctorsService(
      {
        doctorProfile: { findMany, count },
      } as unknown as ConstructorParameters<typeof DoctorsService>[0],
      {} as ConstructorParameters<typeof DoctorsService>[1],
    );
  });

  it('filters doctors by doctor type id', async () => {
    await service.findAll(
      { page: 1, pageSize: 20, skip: 0 },
      { typeId: 'type-cardiology' },
    );

    const expectedWhere = {
      type_id: 'type-cardiology',
      deletedAt: null,
    };

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere }),
    );
    expect(count).toHaveBeenCalledWith({ where: expectedWhere });
  });

  it('searches name, email, and specialty as alternatives', async () => {
    await service.findAll(
      { page: 1, pageSize: 20, skip: 0 },
      { search: 'heart', typeId: 'type-cardiology' },
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            {
              user: {
                name: { contains: 'heart', mode: 'insensitive' },
              },
            },
            {
              user: {
                email: { contains: 'heart', mode: 'insensitive' },
              },
            },
            {
              type: {
                name: { contains: 'heart', mode: 'insensitive' },
              },
            },
          ],
          type_id: 'type-cardiology',
          deletedAt: null,
        },
      }),
    );
  });
});
