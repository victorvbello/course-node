const yargs = require('yargs');
const colors = require('colors/safe');

const { createFileTable, listeTable } = require('./multiply');

const defaultOptions = {
  base: {
    demandOption: true,
    alias: 'b',
    default: 1,
    describe: 'Multiplier base',
  },
  limit: {
    alias: 'l',
    default: 10,
    describe: 'Limit the multiplication table from 1',
  },
};

const argv = yargs
  .command('list', 'Print the multiplication table on the console', defaultOptions)
  .command(
    'create',
    'Create txt file with the multiplication table',
    defaultOptions,
  )
  .help().argv;

console.log(colors.green('CLI App is running'));

const { _: commands, base, limit } = argv;

const [firstCommand] = commands;

switch (firstCommand) {
  case 'list':
    console.log(
      colors.green(`Generating multiplication table from 1 to ${limit} of base ${base}`),
    );
    listeTable(base, limit);
    break;
  case 'create':
    console.log(
      colors.green(`Creating file of multiplication table from 1 to ${limit} of base ${base}`),
    );
    createFileTable(base, limit)
      .then(fileName => console.log(`File created: ${colors.green(fileName)}`))
      .catch(e => console.log(colors.red(e)));
    break;
  default:
    console.log(colors.red('Invalid command'));
    break;
}
