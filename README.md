# cronlens

> Human-readable cron expression parser and next-run visualizer for the terminal

---

## Installation

```bash
npm install -g cronlens
```

---

## Usage

Parse a cron expression and see a human-readable description along with the next scheduled run times:

```bash
cronlens "*/5 * * * *"
```

**Output:**
```
Expression : */5 * * * *
Description: Every 5 minutes

Next 5 runs:
  1 → 2024-06-10 14:25:00
  2 → 2024-06-10 14:30:00
  3 → 2024-06-10 14:35:00
  4 → 2024-06-10 14:40:00
  5 → 2024-06-10 14:45:00
```

You can also specify how many upcoming runs to display:

```bash
cronlens "0 9 * * 1-5" --count 3
```

Or use it programmatically:

```js
const { parse } = require('cronlens');

const result = parse('0 9 * * 1-5');
console.log(result.description); // "At 09:00, Monday through Friday"
console.log(result.nextRuns(3)); // Array of next 3 Date objects
```

---

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--count`, `-n` | Number of next runs to display | `5` |
| `--tz` | Timezone for run times | system local |

---

## License

[MIT](./LICENSE)