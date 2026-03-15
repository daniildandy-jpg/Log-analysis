import { processFileByLine } from "./src/fileReader.js";
import { parseLogLine } from "./src/parser.js";
import { createStats, updateStats, printStats } from "./src/stats.js";
import { 
  filterByLevel, 
  filterByDate, 
  filterByText, 
  filterByTime,
  filterByDateRange,
  filterInfo,
  filterWarning,
} from "./src/filter.js";

async function main() {
  const filePath = "./logs/small-logs.log";
  const stats = createStats();
  const allLogs = [];
  const invalidLogs = []; // собираем невалидные отдельно

  const args = process.argv.slice(2);
  const levelArg    = args.find(a => a.startsWith('--level='))?.split('=')[1];
  const dateArg     = args.find(a => a.startsWith('--date='))?.split('=')[1];
  const textArg     = args.find(a => a.startsWith('--search='))?.split('=')[1];
  const fromArg     = args.find(a => a.startsWith('--from='))?.split('=')[1];
  const toArg       = args.find(a => a.startsWith('--to='))?.split('=')[1];
  const fromDateArg = args.find(a => a.startsWith('--from-date='))?.split('=')[1];
  const toDateArg   = args.find(a => a.startsWith('--to-date='))?.split('=')[1];
  const filterArg   = args.find(a => a.startsWith('--filter='))?.split('=')[1];

  try {
    await processFileByLine(filePath, (line) => {
      const parsed = parseLogLine(line);
      if (parsed) {
        allLogs.push(parsed);       // валидные → в allLogs
      } else {
        invalidLogs.push({          // невалидные → в invalidLogs
          raw: line,
          level: 'UNKNOWN'
        });
      }
      updateStats(stats, parsed);
    });

    // предупреждение если несколько форматов
    const foundFormats = [...new Set(allLogs.map(log => log.format))];
    if (foundFormats.length > 1) {
      console.log(`⚠️  Найдено несколько форматов: ${foundFormats.join(', ')}\n`);
    }

    // если запросили invalid — сразу показываем и выходим
    if (filterArg === 'invalid') {
      console.log(`📋 Невалидных записей: ${invalidLogs.length}\n`);
      invalidLogs.forEach(log => {
        console.log(`❓ INVALID - "${log.raw}"`);
      });
      console.log('\n');
      printStats(stats);
      return;
    }

    // применяем фильтры по очереди
    let filtered = allLogs;
    filtered = filterByLevel(filtered, levelArg);
    filtered = filterByDate(filtered, dateArg);
    filtered = filterByDateRange(filtered, fromDateArg, toDateArg);
    filtered = filterByTime(filtered, fromArg, toArg);
    filtered = filterByText(filtered, textArg);

    // быстрые фильтры
    if (filterArg === 'info')    filtered = filterInfo(filtered);
    if (filterArg === 'warning') filtered = filterWarning(filtered);

    // выводим результат
    console.log(`📋 Найдено записей: ${filtered.length}\n`);
    filtered.forEach(log => {
      console.log(`[${log.level}] ${log.date} ${log.time} - ${log.message}`);
    });

    console.log('\n');
    printStats(stats);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();