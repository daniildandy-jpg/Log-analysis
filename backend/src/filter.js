// filter.js

export function filterByLevel(logs, level) {
  if (!level) return logs;
  return logs.filter(log => log.level === level.toUpperCase());
}

export function filterByDate(logs, date) {
  if (!date) return logs;
  return logs.filter(log => log.date === date);
}

export function filterByDateRange(logs, from, to) {
  if (!from || !to) return logs;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  return logs.filter(log => {
    if (!log.timestamp) return false;
    return log.timestamp >= fromDate && log.timestamp <= toDate;
  });
}

export function filterByTime(logs, fromTime, toTime) {
  if (!fromTime || !toTime) return logs;

  return logs.filter(log => {
    if (!log.time) return false;
    return log.time >= fromTime && log.time <= toTime;
  });
}

export function filterByText(logs, text) {
  if (!text) return logs;
  return logs.filter(log =>
    log.message?.toLowerCase().includes(text.toLowerCase())
  );
}

// быстрый фильтр — только INFO
export function filterInfo(logs) {
  return logs.filter(log => log.level === 'INFO');
}

// быстрый фильтр — только WARNING
export function filterWarning(logs) {
  return logs.filter(log => log.level === 'WARNING');
}