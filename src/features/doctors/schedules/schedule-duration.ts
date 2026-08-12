const MIN_CONSULTATION_MINUTES = 5;
const MAX_CONSULTATION_MINUTES = 180;
const MIN_SLOT_DURATION = 5;
const MAX_SLOT_DURATION = 120;
const SLOT_INCREMENT = 5;

export const calculateAverageSlotDuration = (durations: number[]) => {
  const validDurations = durations.filter(
    (duration) =>
      Number.isFinite(duration) &&
      duration >= MIN_CONSULTATION_MINUTES &&
      duration <= MAX_CONSULTATION_MINUTES,
  );

  if (validDurations.length === 0) return undefined;

  const average =
    validDurations.reduce((total, duration) => total + duration, 0) /
    validDurations.length;
  const rounded = Math.round(average / SLOT_INCREMENT) * SLOT_INCREMENT;

  return Math.min(MAX_SLOT_DURATION, Math.max(MIN_SLOT_DURATION, rounded));
};
