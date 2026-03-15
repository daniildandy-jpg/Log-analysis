export function createStats() {
  return {
    total: 0,
    INFO: 0,
    WARNING: 0,
    ERROR: 0,
    invalid: 0,
    byHour: {},    // { '09': 12, '10': 8, ... }
    topErrors: {}, // { 'DB failed': 3, 'Timeout': 2, ... }
    formats: {},   // { 'standard': 40, 'winston': 9, ... }
  };
}

export function updateStats(stats, log) {
  if (!log) {
    stats.invalid++;
    return;
  }

  stats.total++;

  // считаем уровни
  if (Object.hasOwn(stats, log.level)) {
    stats[log.level]++;
  }

  // считаем по часам — берём первые два символа из времени "09:20:11" → "09"
  if (log.time) {
    const hour = log.time.slice(0, 2);
    stats.byHour[hour] = (stats.byHour[hour] ?? 0) + 1;
  }

  // считаем топ ошибок — только ERROR
  if (log.level === 'ERROR' && log.message) {
    stats.topErrors[log.message] = (stats.topErrors[log.message] ?? 0) + 1;
  }

  // считаем форматы
  if (log.format) {
    stats.formats[log.format] = (stats.formats[log.format] ?? 0) + 1;
  }
}

export function printStats(stats) {
  const total = stats.total + stats.invalid;

  console.log('═══════════════════════════════════════');
  console.log('         📊 СТАТИСТИКА');
  console.log('═══════════════════════════════════════');
  console.log(`Всего строк:    ${total}`);
  console.log(`Валидных:       ${stats.total}`);
  console.log(`Невалидных:     ${stats.invalid}`);
  console.log('───────────────────────────────────────');
  console.log(`✅ INFO:        ${stats.INFO}`);
  console.log(`⚠️  WARNING:    ${stats.WARNING}`);
  console.log(`❌ ERROR:       ${stats.ERROR}`);

  // активность по часам
  if (Object.keys(stats.byHour).length > 0) {
    console.log('───────────────────────────────────────');
    console.log('🕐 АКТИВНОСТЬ ПО ЧАСАМ');
    console.log('───────────────────────────────────────');
    const maxCount = Math.max(...Object.values(stats.byHour));
    Object.entries(stats.byHour)
      .sort(([a], [b]) => a.localeCompare(b)) // сортируем по часу
      .forEach(([hour, count]) => {
        const bar = '█'.repeat(Math.round((count / maxCount) * 20));
        console.log(`${hour}:00  ${bar.padEnd(20)} ${count}`);
      });
  }

  // топ ошибок
  if (Object.keys(stats.topErrors).length > 0) {
    console.log('───────────────────────────────────────');
    console.log('🔥 ТОП ОШИБОК');
    console.log('───────────────────────────────────────');
    Object.entries(stats.topErrors)
      .sort(([, a], [, b]) => b - a) // сортируем по количеству
      .slice(0, 5)                   // топ 5
      .forEach(([message, count], i) => {
        console.log(`${i + 1}. ${message.slice(0, 50)}  × ${count}`);
      });
  }

  // форматы
  if (Object.keys(stats.formats).length > 0) {
    console.log('───────────────────────────────────────');
    console.log('📋 ФОРМАТЫ');
    console.log('───────────────────────────────────────');
    Object.entries(stats.formats).forEach(([format, count]) => {
      console.log(`${format}: ${count}`);
    });
  }

  console.log('═══════════════════════════════════════');
}