#!/usr/bin/env node

/**
 * cronlens CLI entry point
 * Usage: cronlens "<cron expression>" [--count N]
 */

const { parseCron } = require('../parser/cronParser');
const { formatOutput } = require('./formatOutput');

function parseArgs(argv) {
  const args = argv.slice(2);
  let expression = null;
  let count = 5;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' || args[i] === '-n') {
      const val = parseInt(args[i + 1], 10);
      if (!isNaN(val) && val > 0 && val <= 20) {
        count = val;
        i++;
      } else {
        console.error('--count must be a number between 1 and 20');
        process.exit(1);
      }
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    } else if (!expression) {
      expression = args[i];
    }
  }

  return { expression, count };
}

function printHelp() {
  console.log(`
cronlens — Human-readable cron expression parser

Usage:
  cronlens "<expression>" [options]

Options:
  --count, -n <N>   Number of next runs to show (default: 5, max: 20)
  --help,  -h       Show this help message

Examples:
  cronlens "*/15 * * * *"
  cronlens "0 9 * * MON-FRI" --count 10
  cronlens "@daily"
`);
}

function main() {
  const { expression, count } = parseArgs(process.argv);

  if (!expression) {
    console.error('Error: cron expression is required.');
    printHelp();
    process.exit(1);
  }

  try {
    const parsed = parseCron(expression);
    console.log(formatOutput(expression, parsed, count));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
