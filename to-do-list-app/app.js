const yargs = require('yargs');
const colors = require('colors');
const {
  create: createTask,
  all: listTask,
  update: updateTask,
  remove: removeTask,
} = require('./to-do');

const cliAttDescription = {
  demandOption: true,
  alias: 'd',
  describe: 'Task description',
};

const cliAttComplete = {
  alias: 'c',
  default: true,
  describe: 'Complete a task',
};

const argv = yargs
  .command('list', 'List all task', {
    complete: cliAttComplete,
  })
  .command('create', 'Add task to list', {
    description: cliAttDescription,
  })

  .command('update', 'Update task', {
    description: cliAttDescription,
    complete: cliAttComplete,
  })
  .command('remove', 'Remove task to list', {
    description: cliAttDescription,
  })
  .help().argv;

console.log(colors.green('To do app is running'));

const { _: commands, description, complete } = argv;
const safeComplete = (/true/i).test(complete);

const [firstCommand] = commands;

try {
  switch (firstCommand) {
    case 'list':
      console.log(colors.green('Show all task'));
      const tasks = listTask(safeComplete);
      for (let task of tasks) {
        const { description: taskDescription, complete: taskComplete } = task;
        console.log(colors.green('============To Do==========='));
        console.log(taskDescription);
        console.log('Status: ', taskComplete);
        console.log(colors.green('============================'));
      }
      break;
    case 'create':
      console.log(colors.green('Create task'));
      createTask(description);
      break;
    case 'update':
      console.log(colors.green('Update task'));
      if (!updateTask(description, safeComplete)) {
        throw new Error('Update Error', null);
      }
      console.log(colors.green('Update success'));
      break;
    case 'remove':
      console.log(colors.green('Removed task'));
      if (!removeTask(description)) {
        throw new Error('Remove Error', null);
      }
      console.log(colors.green('Remove success'));
      break;
    default:
      throw new Error('Invalid command', null);
  }
} catch (e) {
  console.log(colors.red(e.message));
}
