/**
 * Validates cron expression fields and provides descriptive error messages.
 */

const FIELD_RANGES = {
  minute:     { min: 0, max: 59 },
  hour:       { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month:      { min: 1, max: 12 },
  dayOfWeek:  { min: 0, max: 7 },
};

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

const MONTH_ALIASES = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const DOW_ALIASES   = ['sun','mon','tue','wed','thu','fri','sat'];

function resolveAliasValue(value, fieldName) {
  const lower = value.toLowerCase();
  if (fieldName === 'month') {
    const idx = MONTH_ALIASES.indexOf(lower);
    if (idx !== -1) return idx + 1;
  }
  if (fieldName === 'dayOfWeek') {
    const idx = DOW_ALIASES.indexOf(lower);
    if (idx !== -1) return idx;
  }
  return isNaN(value) ? null : Number(value);
}

function validateSegment(segment, fieldName) {
  const { min, max } = FIELD_RANGES[fieldName];

  if (segment === '*') return null;

  // step: */n or value/n
  if (segment.includes('/')) {
    const [base, step] = segment.split('/');
    if (isNaN(step) || Number(step) < 1) {
      return `Invalid step value "${step}" in field "${fieldName}"`;
    }
    if (base !== '*') {
      const num = resolveAliasValue(base, fieldName);
      if (num === null || num < min || num > max) {
        return `Value "${base}" out of range [${min}-${max}] in field "${fieldName}"`;
      }
    }
    return null;
  }

  // range: a-b
  if (segment.includes('-')) {
    const [from, to] = segment.split('-');
    const numFrom = resolveAliasValue(from, fieldName);
    const numTo   = resolveAliasValue(to, fieldName);
    if (numFrom === null || numFrom < min || numFrom > max) {
      return `Range start "${from}" out of range [${min}-${max}] in field "${fieldName}"`;
    }
    if (numTo === null || numTo < min || numTo > max) {
      return `Range end "${to}" out of range [${min}-${max}] in field "${fieldName}"`;
    }
    if (numFrom > numTo) {
      return `Range start "${from}" is greater than end "${to}" in field "${fieldName}"`;
    }
    return null;
  }

  // plain value
  const num = resolveAliasValue(segment, fieldName);
  if (num === null || num < min || num > max) {
    return `Value "${segment}" out of range [${min}-${max}] in field "${fieldName}"`;
  }
  return null;
}

function validateCron(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    return { valid: false, errors: ['Expression must be a non-empty string'] };
  }

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      errors: [`Expected 5 fields, got ${parts.length}`],
    };
  }

  const errors = [];
  parts.forEach((part, i) => {
    const fieldName = FIELD_NAMES[i];
    part.split(',').forEach(segment => {
      const err = validateSegment(segment, fieldName);
      if (err) errors.push(err);
    });
  });

  return { valid: errors.length === 0, errors };
}

module.exports = { validateCron, FIELD_NAMES, FIELD_RANGES };
