type DashboardStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'CHECKING'
  | 'COMPLETED';

type StatusCount = {
  status: DashboardStatus;
  _count: { _all: number };
};

const WAITING_STATUSES = new Set<DashboardStatus>([
  'PENDING',
  'CONFIRMED',
  'CHECKING',
]);

export function mapStatusCounts(statusCounts: StatusCount[]) {
  const breakdown = {
    PENDING: 0,
    CONFIRMED: 0,
    CHECKING: 0,
    COMPLETED: 0,
  };

  for (const item of statusCounts) {
    if (item.status !== 'CANCELLED') {
      breakdown[item.status] = item._count._all;
    }
  }

  return {
    total: Object.values(breakdown).reduce((sum, count) => sum + count, 0),
    waiting: statusCounts.reduce(
      (sum, item) =>
        WAITING_STATUSES.has(item.status) ? sum + item._count._all : sum,
      0,
    ),
    completed: breakdown.COMPLETED,
    breakdown,
  };
}
