/**
 * Centralised error formatting for CLI output.
 * Integrates with validateCron to surface friendly messages.
 */

const { validateCron } = require('../parser/validate');

const RESET  = '\x1b[0m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BOLD   = '\x1b[1m';

function formatValidationErrors(expression, errors) {
  const lines = [
    `${RED}${BOLD}Invalid cron expression:${RESET} ${YELLOW}${expression}${RESET}`,
    '',
  ];
  errors.forEach((err, i) => {
    lines.push(`  ${RED}${i + 1}.${RESET} ${err}`);
  });
  lines.push('');
  lines.push(`${YELLOW}Tip:${RESET} A cron expression has 5 space-separated fields:`);
  lines.push('  <minute> <hour> <day-of-month> <month> <day-of-week>');
  lines.push('  Ranges (1-5), lists (1,3,5), steps (*/2), and aliases (mon, jan) are supported.');
  return lines.join('\n');
}

function handleError(err, context = {}) {
  if (context.expression) {
    const { valid, errors } = validateCron(context.expression);
    if (!valid) {
      return {
        message: formatValidationErrors(context.expression, errors),
        exitCode: 1,
      };
    }
  }

  const message = [
    `${RED}${BOLD}Error:${RESET} ${err.message || String(err)}`,
  ].join('\n');

  return { message, exitCode: 1 };
}

function checkAndExit(expression) {
  const { valid, errors } = validateCron(expression);
  if (!valid) {
    process.stderr.write(formatValidationErrors(expression, errors) + '\n');
    process.exit(1);
  }
}

module.exports = { handleError, checkAndExit, formatValidationErrors };
