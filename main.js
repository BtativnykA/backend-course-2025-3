const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-i, --input <path>', 'шлях до файлу JSON')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-f, --furnished', 'показати лише будинки з меблями (furnished)')
  .option('-p, --price <number>', 'показати будинки з ціною менше за вказану');

program.parse(process.argv);
const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Читання файлу
let fileContent;
try {
  fileContent = fs.readFileSync(options.input, 'utf-8');
} catch (error) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Розбиваємо на рядки (NDJSON формат - кожен об'єкт в окремому рядку)
const lines = fileContent.split('\n').filter(line => line.trim() !== '');

let results = [];

// Обробка кожного рядка
for (const line of lines) {
  try {
    const house = JSON.parse(line);
    
    // Фільтр за furnished
    if (options.furnished && house.furnishingstatus !== 'furnished') {
      continue;
    }

    // Фільтр за ціною
    if (options.price && parseFloat(house.price) >= parseFloat(options.price)) {
      continue;
    }

    // Додаємо результат (ціна + площа)
    results.push(`${house.price} ${house.area}`);
  } catch (e) {
    // Якщо рядок не валідний JSON - просто пропускаємо
    // Можна розкоментувати для відлагодження:
    // console.error('Помилка парсингу:', e.message);
  }
}

const outputText = results.join('\n');

// Запис у файл
if (options.output) {
  fs.writeFileSync(options.output, outputText);
}

// Виведення у консоль
if (options.display) {
  console.log(outputText);
}

// Якщо не задано output і display — нічого не виводимо