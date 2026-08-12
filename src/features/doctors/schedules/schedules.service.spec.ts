import { SchedulesService } from './schedules.service';

describe('SchedulesService', () => {
  const appointmentFindMany = jest.fn();
  const scheduleUpdateMany = jest.fn();
  let service: SchedulesService;

  beforeEach(() => {
    jest.clearAllMocks();
    scheduleUpdateMany.mockResolvedValue({ count: 1 });

    service = new SchedulesService({
      appointment: { findMany: appointmentFindMany },
      schedule: { updateMany: scheduleUpdateMany },
    } as unknown as ConstructorParameters<typeof SchedulesService>[0]);
  });

  it('updates a doctor active schedules using their average consultation time', async () => {
    appointmentFindMany.mockResolvedValue([
      {
        doctorId: 'doctor-1',
        actualStartTime: new Date('2026-08-11T02:00:00.000Z'),
        actualEndTime: new Date('2026-08-11T02:24:00.000Z'),
      },
      {
        doctorId: 'doctor-1',
        actualStartTime: new Date('2026-08-11T03:00:00.000Z'),
        actualEndTime: new Date('2026-08-11T03:31:00.000Z'),
      },
    ]);

    await expect(
      service.updateSlotDurationsFromConsultationAverages(),
    ).resolves.toEqual({ updatedDoctors: 1, completedAppointments: 2 });

    expect(scheduleUpdateMany).toHaveBeenCalledWith({
      where: {
        doctor_id: 'doctor-1',
        isActive: true,
        deletedAt: null,
        slotDuration: { not: 30 },
      },
      data: { slotDuration: 30 },
    });
  });

  it('leaves schedules unchanged when consultation timings are invalid', async () => {
    appointmentFindMany.mockResolvedValue([
      {
        doctorId: 'doctor-1',
        actualStartTime: new Date('2026-08-11T03:00:00.000Z'),
        actualEndTime: new Date('2026-08-11T02:00:00.000Z'),
      },
    ]);

    await expect(
      service.updateSlotDurationsFromConsultationAverages(),
    ).resolves.toEqual({ updatedDoctors: 0, completedAppointments: 1 });
    expect(scheduleUpdateMany).not.toHaveBeenCalled();
  });
});
