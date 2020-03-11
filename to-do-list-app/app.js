const yargs = require('yargs');
const colors = require('colors');
const {
  create: createTask,
  all: listTask,
  update: updateTask,
} = require('./to-do');

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
      console.log(colors.green('Create task'));
      createTask(description);
      break;
    case 'list':
      console.log(colors.green('Show all task'));
      const tasks = listTask();
      for (let task of tasks) {
        const { description: taskDescription, complete: taskComplete } = task;
        console.log(colors.green('============To Do==========='));
        console.log(taskDescription);
        console.log('Status: ', taskComplete);
        console.log(colors.green('============================'));
      }
      break;
    case 'update':
      console.log(colors.green('Update task'));
      const result = updateTask(description, complete);
      if(!result) {
        throw new Error('Update Error', null);
      }
      console.log(colors.green('Update success'));
      break;
    default:
      throw new Error('Invalid command', null);
  }
} catch (e) {
  console.log(colors.red(e.message));
}
