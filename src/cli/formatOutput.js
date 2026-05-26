/**
 * Formats parsed cron data for terminal output
 */

const { humanize } = require('../parser/humanize');
const { getNextRuns } = require('../parser/nextRuns');

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

function formatNextRuns(dates) {
  return dates.map((date, i) => {
    const label = `  ${i + 1}.`;
    const dateStr = date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const now = Date.now();
    const diffMs = date.getTime() - now;
    const diffMins = Math.round(diffMs / 60000);
    const diffLabel =
      diffMins < 60
        ? `in ${diffMins}m`
        : diffMins < 1440
        ? `in ${Math.round(diffMins / 60)}h`
        : `in ${Math.round(diffMins / 1440)}d`;
    return `${c('gray', label)} ${c('green', dateStr)} ${c('dim', diffLabel)}`;
  });
}

function formatOutput(expression, parsed, count = 5) {
  const lines = [];
  lines.push('');
  lines.push(`${c('bold', 'Expression:')} ${c('cyan', expression)}`);
  lines.push(`${c('bold', 'Meaning:')}    ${c('yellow', humanize(parsed))}`);
  lines.push('');
  lines.push(c('magenta', `Next ${count} runs:`));

  const nextDates = getNextRuns(parsed, count);
  if (nextDates.length === 0) {
    lines.push(c('gray', '  No upcoming runs found.'));
  } else {
    lines.push(...formatNextRuns(nextDates));
  }

  lines.push('');
  return lines.join('\n');
}

module.exports = { formatOutput, formatNextRuns };
