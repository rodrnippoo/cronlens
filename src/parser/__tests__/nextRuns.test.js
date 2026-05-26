const { parseCron } = require('../cronParser');
const { getNextRuns } = require('../nextRuns');

describe('getNextRuns', () => {
  const baseDate = new Date('2024-01-15T08:00:00.000Z');

  test('returns the correct number of results', () => {
    const parsed = parseCron('* * * * *');
    const runs = getNextRuns(parsed, 5, baseDate);
    expect(runs).toHaveLength(5);
  });

  test('next runs are strictly after the from date', () => {
    const parsed = parseCron('* * * * *');
    const runs = getNextRuns(parsed, 3, baseDate);
    runs.forEach(run => expect(run.getTime()).toBeGreaterThan(baseDate.getTime()));
  });

  test('hourly cron runs once per hour', () => {
    const parsed = parseCron('0 * * * *');
    const from = new Date('2024-01-15T08:30:00.000Z');
    const runs = getNextRuns(parsed, 3, from);
    expect(runs[0].getMinutes()).toBe(0);
    expect(runs[1].getMinutes()).toBe(0);
    const diffMs = runs[1].getTime() - runs[0].getTime();
    expect(diffMs).toBe(60 * 60 * 1000);
  });

  test('daily cron produces runs 24 hours apart', () => {
    const parsed = parseCron('0 9 * * *');
    const from = new Date('2024-01-15T09:01:00.000Z');
    const runs = getNextRuns(parsed, 2, from);
    expect(runs).toHaveLength(2);
    const diffMs = runs[1].getTime() - runs[0].getTime();
    expect(diffMs).toBe(24 * 60 * 60 * 1000);
  });

  test('returns empty array when no match found within limit', () => {
    // Feb 30 never exists — effectively unmatchable
    const parsed = parseCron('0 0 30 2 *');
    const runs = getNextRuns(parsed, 1, new Date('2024-01-01T00:00:00.000Z'));
    expect(runs).toHaveLength(0);
  });
});
