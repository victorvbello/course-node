const yargs = require('yargs');
const colors = require('colors');

const argv = yargs
  .command('create', 'Add task to list', {
    description: {
      demandOption: true,
      alias: 'd',
      default: 'empty',
      describe: 'Task description',
    },
  })
  .command('list', 'List all task', {})
  .command('update', 'Update task', {
    description: {
      demandOption: true,
      alias: 'd',
      default: 'empty',
      describe: 'Task description',
    },
    complete: {
      demandOption: true,
      alias: 'c',
      default: false,
      describe: 'Complete task',
    },
  })
  .help().argv;

  console.log(colors.green('To do app is running'));

  console.log(argv);
