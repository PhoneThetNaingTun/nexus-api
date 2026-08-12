import { calculateAverageSlotDuration } from './schedule-duration';

describe('calculateAverageSlotDuration', () => {
  it('averages valid consultations and rounds to five-minute slots', () => {
    expect(calculateAverageSlotDuration([24, 31, 35])).toBe(30);
  });

  it('ignores invalid and implausible consultation durations', () => {
    expect(calculateAverageSlotDuration([-1, 0, Number.NaN, 4, 45, 181])).toBe(
      45,
    );
  });

  it('caps long averages at two hours', () => {
    expect(calculateAverageSlotDuration([150, 160])).toBe(120);
  });

  it('returns undefined when there is no usable history', () => {
    expect(calculateAverageSlotDuration([])).toBeUndefined();
  });
});
