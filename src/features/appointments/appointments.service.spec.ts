import { AppointmentStatus } from 'generated/prisma/client';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  const findUnique = jest.fn();
  const update = jest.fn();
  let service: AppointmentsService;

  beforeEach(() => {
    jest.clearAllMocks();
    update.mockImplementation(({ data }) => ({ id: 'appointment-1', ...data }));

    service = new AppointmentsService({
      appointment: { findUnique, update },
    } as unknown as ConstructorParameters<typeof AppointmentsService>[0]);
  });

  it('records the consultation start when a doctor starts checking a patient', async () => {
    findUnique.mockResolvedValue({
      id: 'appointment-1',
      actualStartTime: null,
      actualEndTime: null,
    });

    await service.updateStatus('appointment-1', {
      status: AppointmentStatus.CHECKING,
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: 'appointment-1' },
      data: {
        status: AppointmentStatus.CHECKING,
        actualStartTime: expect.any(Date),
      },
    });
  });

  it('records the consultation end when the appointment is completed', async () => {
    findUnique.mockResolvedValue({
      id: 'appointment-1',
      actualStartTime: new Date('2026-08-11T02:00:00.000Z'),
      actualEndTime: null,
    });

    await service.updateStatus('appointment-1', {
      status: AppointmentStatus.COMPLETED,
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: 'appointment-1' },
      data: {
        status: AppointmentStatus.COMPLETED,
        actualEndTime: expect.any(Date),
      },
    });
  });

  it('does not overwrite an existing consultation start time', async () => {
    const actualStartTime = new Date('2026-08-11T02:00:00.000Z');
    findUnique.mockResolvedValue({
      id: 'appointment-1',
      actualStartTime,
      actualEndTime: null,
    });

    await service.updateStatus('appointment-1', {
      status: AppointmentStatus.CHECKING,
    });

    expect(update).toHaveBeenCalledWith({
      where: { id: 'appointment-1' },
      data: { status: AppointmentStatus.CHECKING },
    });
  });
});
