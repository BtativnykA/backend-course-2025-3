const fs = require('fs');
const { Command } = require('commander');
const program = new Command();

program
  .option('-i, --input <path>', 'шлях до файлу JSON')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-f, --furnished', 'показати лише будинки з меблями (furnished)')
  .option('-p, --price <number>', 'показати будинки з ціною менше за вказану');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

let fileContent;
try {
  fileContent = fs.readFileSync(options.input, 'utf-8');
} catch (error) {
  console.error('Cannot find input file');
  process.exit(1);
}

const lines = fileContent.split('\n').filter(line => line.trim() !== '');

let results = [];

for (const line of lines) {
  try {
    const house = JSON.parse(line);

    if (options.furnished && house.furnishingstatus !== 'furnished') {
      continue;
    }

    if (options.price && parseFloat(house.price) >= parseFloat(options.price)) {
      continue;
    }

    results.push(`${house.price} ${house.area}`);
  } catch (e) {
  }
}

const outputText = results.join('\n');

if (options.output) {
  fs.writeFileSync(options.output, outputText);
}

if (options.display) {
  console.log(outputText);
}