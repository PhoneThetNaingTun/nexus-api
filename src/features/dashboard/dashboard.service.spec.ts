import { mapStatusCounts } from './dashboard.utils';

describe('mapStatusCounts', () => {
  it('builds total, waiting, completed, and status breakdown values', () => {
    const result = mapStatusCounts([
      {
        status: 'PENDING',
        _count: { _all: 2 },
      },
      {
        status: 'CONFIRMED',
        _count: { _all: 3 },
      },
      {
        status: 'CHECKING',
        _count: { _all: 1 },
      },
      {
        status: 'COMPLETED',
        _count: { _all: 4 },
      },
    ]);

    expect(result).toEqual({
      total: 10,
      waiting: 6,
      completed: 4,
      breakdown: {
        PENDING: 2,
        CONFIRMED: 3,
        CHECKING: 1,
        COMPLETED: 4,
      },
    });
  });

  it('does not include cancelled appointments', () => {
    const result = mapStatusCounts([
      {
        status: 'CANCELLED',
        _count: { _all: 5 },
      },
    ]);

    expect(result.total).toBe(0);
    expect(result.waiting).toBe(0);
    expect(result.completed).toBe(0);
  });
});
