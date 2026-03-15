const LEVELS = '(INFO|WARNING|WARN|ERROR|DEBUG|FATAL|VERBOSE|TRACE)';

const FORMATS = [
  // Стандартный: 2026-03-05 09:20:11 INFO message
  {
    name: 'standard',
    regex: new RegExp(`^(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2}) ${LEVELS} (.+)$`),
    parse: (match) => ({
      date: match[1],
      time: match[2],
      level: match[3].toUpperCase(), // ← добавил нормализацию
      message: match[4],
    })
  },

  // ISO с T: 2026-03-05T09:20:11 INFO message
  {
    name: 'iso',
    regex: new RegExp(`^(\\d{4}-\\d{2}-\\d{2})T(\\d{2}:\\d{2}:\\d{2}) ${LEVELS} (.+)$`),
    parse: (match) => ({
      date: match[1],
      time: match[2],
      level: match[3].toUpperCase(),
      message: match[4],
    })
  },

  // Миллисекунды: 2026-03-05 09:20:11.123 INFO message
  {
    name: 'milliseconds',
    regex: new RegExp(`^(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2})\\.(\\d{3}) ${LEVELS} (.+)$`),
    parse: (match) => ({
      date: match[1],
      time: match[2],
      milliseconds: match[3],
      level: match[4].toUpperCase(),
      message: match[5],
    })
  },

  // Европейский: 05/03/2026 09:20:11 INFO message
  {
    name: 'european',
    regex: new RegExp(`^(\\d{2})\\/(\\d{2})\\/(\\d{4}) (\\d{2}:\\d{2}:\\d{2}) ${LEVELS} (.+)$`),
    parse: (match) => ({
      date: `${match[3]}-${match[2]}-${match[1]}`,
      time: match[4],
      level: match[5].toUpperCase(),
      message: match[6],
    })
  },

  // Браузер: [ERROR] message
  {
    name: 'browser',
    regex: new RegExp(`^\\[${LEVELS.slice(1, -1)}\\] (.+)$`), // убираем внешние скобки из LEVELS
    parse: (match) => ({
      date: null,
      time: null,
      level: match[1].toUpperCase(),
      message: match[2],
    })
  },

  // Winston простой: 2026-03-05 09:15:32 info message  ← исправлен
  {
    name: 'winston',
    regex: new RegExp(`^(\\d{4}-\\d{2}-\\d{2}) (\\d{2}:\\d{2}:\\d{2}) (\\w+) (.+)$`),
    parse: (match) => ({
      date: match[1],
      time: match[2],
      level: match[3].toUpperCase(), // warn → WARNING, info → INFO
      message: match[4],
    })
  },

  // Winston ISO: 2026-03-05T09:20:11.123Z info message
  {
    name: 'winston-iso',
    regex: /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}\.\d{3}Z) (\w+) (.+)$/,
    parse: (match) => ({
      date: match[1],
      time: match[2],
      level: match[3].toUpperCase(),
      message: match[4],
    })
  },
];

export function parseLogLine(line) {
  if (typeof line !== 'string') return null;

  for (const format of FORMATS) {
    const match = line.match(format.regex);

    if (match) {
      const parsed = format.parse(match);
      return {
        ...parsed,
        format: format.name,
        timestamp: parsed.date && parsed.time
          ? new Date(`${parsed.date}T${parsed.time}`)
          : null
      };
    }
  }

  return null;
}