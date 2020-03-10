const yargs = require('yargs');
const colors = require('colors');
const { create } = require('./to-do');

const argv = yargs
  .command('create', 'Add task to list', {
    description: {
      demandOption: true,
      alias: 'd',
      describe: 'Task description',
    },
  })
  .command('list', 'List all task', {})
  .command('update', 'Update task', {
    description: {
      demandOption: true,
      alias: 'd',
      describe: 'Task description',
    },
    complete: {
      alias: 'c',
      default: true,
      describe: 'Complete a task',
    },
  })
  .help().argv;

console.log(colors.green('To do app is running'));

const { _: commands, description, complete } = argv;

const [firstCommand] = commands;

try {
  switch (firstCommand) {
    case 'create':
      create(description);
      console.log(colors.green('Create task'));
      break;
    case 'list':
      console.log(colors.green('Show all task'));
      break;
    case 'update':
      console.log(colors.green('Update task'));
      break;
    default:
      throw new Error('Invalid command', null);
      break;
  }
} catch (e) {
  console.log(colors.red(e.message));
}
