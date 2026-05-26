const { validateCron } = require('../validate');

describe('validateCron', () => {
  test('accepts a standard valid expression', () => {
    expect(validateCron('*/5 * * * *')).toEqual({ valid: true, errors: [] });
  });

  test('accepts specific values within range', () => {
    expect(validateCron('0 9 1 1 0')).toEqual({ valid: true, errors: [] });
  });

  test('accepts ranges', () => {
    expect(validateCron('0 9-17 * * 1-5')).toEqual({ valid: true, errors: [] });
  });

  test('accepts month and day-of-week aliases', () => {
    expect(validateCron('0 0 1 jan mon')).toEqual({ valid: true, errors: [] });
  });

  test('accepts comma-separated lists', () => {
    expect(validateCron('0 8,12,18 * * *')).toEqual({ valid: true, errors: [] });
  });

  test('rejects wrong number of fields', () => {
    const result = validateCron('* * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Expected 5 fields/);
  });

  test('rejects empty string', () => {
    const result = validateCron('');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('rejects minute out of range', () => {
    const result = validateCron('60 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/minute/);
  });

  test('rejects hour out of range', () => {
    const result = validateCron('0 25 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/hour/);
  });

  test('rejects invalid step value', () => {
    const result = validateCron('*/0 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/step/);
  });

  test('rejects inverted range', () => {
    const result = validateCron('0 18-9 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/greater than/);
  });

  test('accumulates multiple errors', () => {
    const result = validateCron('99 99 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});
