const yargs = require('yargs');
const colors = require('colors/safe');

const { createFileTable, listeTable } = require('./multiply');

const defaultOptions = {
  base: {
    demandOption: true,
    alias: 'b',
    default: 1,
    describe: 'Base multiplicadora',
  },
  limit: {
    alias: 'l',
    default: 10,
    describe: 'Limite de la tabla de multiplicar desde el 1',
  },
};

const argv = yargs
  .command('list', 'Imprime en consola la tabla de multiplicar', defaultOptions)
  .command(
    'create',
    'Crea archivo txt con la tabla de multiplicar',
    defaultOptions,
  )
  .help().argv;

console.log(colors.green('CLI App is running'));

const { _: commands, base, limit } = argv;

const [firstCommand] = commands;

switch (firstCommand) {
  case 'list':
    console.log(
      colors.green(`Generando tabla de multiplicar del 1 al ${limit} de base ${base}`),
    );
    listeTable(base, limit);
    break;
  case 'create':
    console.log(
      colors.green(`Creando archivo de tabla de multiplicar del 1 al ${limit} de base ${base}`),
    );
    createFileTable(base, limit)
      .then(fileName => console.log(`Archivo creado: ${colors.green(fileName)}`))
      .catch(e => console.log(colors.red(e)));
    break;
  default:
    console.log(colors.red('Comando invalido'));
    break;
}
