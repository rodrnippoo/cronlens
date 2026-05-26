/**
 * Converts parsed cron fields into a human-readable English description.
 */

const MONTH_LABELS = ['','January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const WEEKDAY_LABELS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function listValues(values, labels) {
  const named = values.map(v => labels ? labels[v] : v);
  if (named.length === 1) return named[0];
  const last = named.pop();
  return named.join(', ') + ' and ' + last;
}

function describeField(field, values, raw) {
  const { min, max } = require('./cronParser').FIELD_RANGES[field];
  const isAll = values.length === (max - min + 1);

  switch (field) {
    case 'minute':
      if (isAll) return 'every minute';
      if (raw.includes('/')) {
        const step = raw.split('/')[1];
        return `every ${step} minute(s)`;
      }
      return `at minute ${listValues(values)}`;

    case 'hour':
      if (isAll) return 'every hour';
      if (raw.includes('/')) {
        const step = raw.split('/')[1];
        return `every ${step} hour(s)`;
      }
      return `at ${listValues(values.map(h => `${String(h).padStart(2,'0')}:00`))}`;

    case 'day':
      if (isAll) return 'every day';
      return `on day ${listValues(values)} of the month`;

    case 'month':
      if (isAll) return 'every month';
      return `in ${listValues(values, MONTH_LABELS)}`;

    case 'weekday':
      if (isAll) return 'every day of the week';
      return `on ${listValues(values, WEEKDAY_LABELS)}`;

    default:
      return raw;
  }
}

function humanize(parsed) {
  const minute  = describeField('minute',  parsed.minute.values,  parsed.minute.raw);
  const hour    = describeField('hour',    parsed.hour.values,    parsed.hour.raw);
  const day     = describeField('day',     parsed.day.values,     parsed.day.raw);
  const month   = describeField('month',   parsed.month.values,   parsed.month.raw);
  const weekday = describeField('weekday', parsed.weekday.values, parsed.weekday.raw);

  const timeStr = `${minute}, ${hour}`;
  const dateStr = [day, month, weekday]
    .filter(d => !d.includes('every day') && !d.includes('every month') && !d.includes('every day of'))
    .join(', ');

  return dateStr ? `Runs ${timeStr} — ${dateStr}` : `Runs ${timeStr}`;
}

module.exports = { humanize };
