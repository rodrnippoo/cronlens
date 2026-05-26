/**
 * Computes the next N run dates for a parsed cron expression.
 */

function matchesCron(date, parsed) {
  const m  = date.getMinutes();
  const h  = date.getHours();
  const d  = date.getDate();
  const mo = date.getMonth() + 1;
  const wd = date.getDay();

  const wildcardDay     = parsed.day.raw === '*';
  const wildcardWeekday = parsed.weekday.raw === '*';

  const dayMatch = wildcardDay && wildcardWeekday
    ? true
    : wildcardDay
      ? parsed.weekday.values.includes(wd)
      : wildcardWeekday
        ? parsed.day.values.includes(d)
        : parsed.day.values.includes(d) || parsed.weekday.values.includes(wd);

  return (
    parsed.minute.values.includes(m) &&
    parsed.hour.values.includes(h) &&
    dayMatch &&
    parsed.month.values.includes(mo)
  );
}

function getNextRuns(parsed, count = 5, from = new Date()) {
  const results = [];
  const cursor = new Date(from);

  // Start from next minute
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const MAX_ITERATIONS = 525960; // ~1 year of minutes
  let iterations = 0;

  while (results.length < count && iterations < MAX_ITERATIONS) {
    if (matchesCron(cursor, parsed)) {
      results.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
    iterations++;
  }

  return results;
}

module.exports = { getNextRuns };
