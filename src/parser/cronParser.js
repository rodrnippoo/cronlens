/**
 * Parses a cron expression into its component fields.
 * Supports standard 5-field cron: minute hour day month weekday
 */

const FIELD_NAMES = ['minute', 'hour', 'day', 'month', 'weekday'];

const FIELD_RANGES = {
  minute:  { min: 0, max: 59 },
  hour:    { min: 0, max: 23 },
  day:     { min: 1, max: 31 },
  month:   { min: 1, max: 12 },
  weekday: { min: 0, max: 6 },
};

const MONTH_NAMES = {
  jan:1, feb:2, mar:3, apr:4, may:5, jun:6,
  jul:7, aug:8, sep:9, oct:10, nov:11, dec:12,
};

const WEEKDAY_NAMES = {
  sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6,
};

function resolveAlias(value, field) {
  if (field === 'month') return MONTH_NAMES[value.toLowerCase()] ?? value;
  if (field === 'weekday') return WEEKDAY_NAMES[value.toLowerCase()] ?? value;
  return value;
}

function expandField(expr, field) {
  const { min, max } = FIELD_RANGES[field];
  const values = new Set();

  for (const part of expr.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes('/')) {
      const [range, step] = part.split('/');
      const stepNum = parseInt(step, 10);
      const [start, end] = range === '*'
        ? [min, max]
        : range.split('-').map(Number);
      for (let i = start; i <= (end ?? max); i += stepNum) values.add(i);
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(v => Number(resolveAlias(v, field)));
      for (let i = start; i <= end; i++) values.add(i);
    } else {
      values.add(Number(resolveAlias(part, field)));
    }
  }

  return [...values].sort((a, b) => a - b);
}

function parseCron(expression) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(`Invalid cron expression: expected 5 fields, got ${parts.length}`);
  }

  const parsed = {};
  for (let i = 0; i < FIELD_NAMES.length; i++) {
    const field = FIELD_NAMES[i];
    parsed[field] = {
      raw: parts[i],
      values: expandField(parts[i], field),
    };
  }

  return parsed;
}

module.exports = { parseCron, FIELD_NAMES, FIELD_RANGES };
