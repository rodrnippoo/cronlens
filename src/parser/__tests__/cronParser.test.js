const { parseCron } = require('../cronParser');

describe('parseCron', () => {
  test('parses a simple cron expression', () => {
    const result = parseCron('0 9 * * 1');
    expect(result.minute.values).toEqual([0]);
    expect(result.hour.values).toEqual([9]);
    expect(result.day.values).toHaveLength(31);
    expect(result.weekday.values).toEqual([1]);
  });

  test('expands wildcard fields fully', () => {
    const result = parseCron('* * * * *');
    expect(result.minute.values).toHaveLength(60);
    expect(result.hour.values).toHaveLength(24);
    expect(result.month.values).toHaveLength(12);
  });

  test('handles step values', () => {
    const result = parseCron('*/15 * * * *');
    expect(result.minute.values).toEqual([0, 15, 30, 45]);
  });

  test('handles ranges', () => {
    const result = parseCron('0 9-17 * * *');
    expect(result.hour.values).toEqual([9,10,11,12,13,14,15,16,17]);
  });

  test('handles comma-separated values', () => {
    const result = parseCron('0 8,12,18 * * *');
    expect(result.hour.values).toEqual([8, 12, 18]);
  });

  test('handles month name aliases', () => {
    const result = parseCron('0 0 1 jan,dec *');
    expect(result.month.values).toEqual([1, 12]);
  });

  test('handles weekday name aliases', () => {
    const result = parseCron('0 0 * * mon,fri');
    expect(result.weekday.values).toEqual([1, 5]);
  });

  test('throws on invalid field count', () => {
    expect(() => parseCron('0 9 * *')).toThrow('expected 5 fields');
    expect(() => parseCron('0 9 * * * *')).toThrow('expected 5 fields');
  });
});
