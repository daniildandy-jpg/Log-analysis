# Project: Log Analyzer (File Reader CLI)

## Description

CLI инструмент на Node.js для чтения, анализа и фильтрации лог-файлов.
Программа читает файл построчно, парсит записи логов, фильтрует данные и выводит статистику.

Проект создан для практики JavaScript и Node.js вне веб-разработки:

* работа с файловой системой
* обработка текстовых данных
* CLI интерфейс
* фильтрация и анализ данных

---

# Technology Stack

## Core Platform

* Node.js — среда выполнения JavaScript

## Node.js Core Modules

* fs — чтение и запись файлов
* path — работа с файловыми путями
* readline — построчное чтение больших файлов

## JavaScript Features

* RegExp — парсинг строк логов
* Array methods (map, filter, reduce, sort) — обработка данных
* Objects — хранение структурированных данных

## CLI Tools

* commander — обработка аргументов командной строки

## Output / UX

* chalk — цветной вывод в терминале

## Optional Libraries

* lodash — удобная работа с массивами и объектами
* csv-writer — экспорт результатов в CSV

---

# Project Tasks

## 1. File Reading

* получить путь к лог-файлу
* проверить существование файла
* читать файл построчно через stream

## 2. Log Parsing

преобразовать строку лога в объект:

example log line:
2026-03-05 12:03:11 ERROR Database connection failed

parsed object:
{
date: "2026-03-05",
time: "12:03:11",
level: "ERROR",
message: "Database connection failed"
}

## 3. Filtering

реализовать фильтрацию логов:

* по уровню (INFO / WARNING / ERROR)
* по дате
* по ключевому слову
* по диапазону времени

example CLI:

node index.js logs.txt --level ERROR

---

## 4. Search

поиск логов по тексту сообщения

example:

node index.js logs.txt --search database

---

## 5. Statistics

подсчёт статистики:

* общее количество логов
* количество INFO
* количество WARNING
* количество ERROR

example output:

Total logs: 120
INFO: 95
WARNING: 15
ERROR: 10

---

## 6. Sorting

сортировка логов:

* по времени
* по уровню
* по дате

---

## 7. Colored Output

использовать цветной вывод:

ERROR → красный
WARNING → жёлтый
INFO → зелёный

---

## 8. Export Results

сохранение результата:

* JSON
* CSV
* TXT

example:

node index.js logs.txt --level ERROR --save errors.txt

---

# Project Structure

log-analyzer/

logs/
sample.log

src/
fileReader.js
parser.js
filter.js
stats.js
formatter.js

index.js
package.json
README.md

---

# Learning Goals

Этот проект демонстрирует навыки:

* работа с Node.js
* работа с файловой системой
* stream обработка больших файлов
* парсинг текстовых данных
* CLI инструменты
* обработка данных в JavaScript
* архитектура модульного проекта
