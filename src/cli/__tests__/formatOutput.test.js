const { formatOutput, formatNextRuns } = require('../formatOutput');
const { parseCron } = require('../../parser/cronParser');

describe('formatNextRuns', () => {
  it('formats an array of dates with index labels', () => {
    const now = new Date();
    const future = new Date(now.getTime() + 60 * 60 * 1000); // +1h
    const lines = formatNextRuns([future]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/1\./);
    expect(lines[0]).toMatch(/in \d+/);
  });

  it('returns one line per date', () => {
    const base = Date.now();
    const dates = Array.from({ length: 3 }, (_, i) =>
      new Date(base + (i + 1) * 60000)
    );
    const lines = formatNextRuns(dates);
    expect(lines).toHaveLength(3);
  });
});

describe('formatOutput', () => {
  it('includes the original expression in output', () => {
    const expr = '*/10 * * * *';
    const parsed = parseCron(expr);
    const output = formatOutput(expr, parsed, 3);
    expect(output).toContain(expr);
  });

  it('includes humanized description in output', () => {
    const expr = '0 12 * * *';
    const parsed = parseCron(expr);
    const output = formatOutput(expr, parsed, 3);
    expect(output).toMatch(/Meaning/i);
  });

  it('shows correct number of next runs', () => {
    const expr = '*/5 * * * *';
    const parsed = parseCron(expr);
    const output = formatOutput(expr, parsed, 4);
    // 4 numbered entries: lines matching "  1.", "  2.", etc.
    const matches = output.match(/\s+\d+\./g) || [];
    expect(matches).toHaveLength(4);
  });

  it('handles @daily alias gracefully', () => {
    const expr = '@daily';
    const parsed = parseCron(expr);
    const output = formatOutput(expr, parsed, 2);
    expect(output).toContain('@daily');
    expect(output).toMatch(/Next 2 runs/i);
  });
});
