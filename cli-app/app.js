const yargs = require('yargs');
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

console.log('CLI App is running');

const { _: commands, base, limit } = argv;

const [firstCommand] = commands;

switch (firstCommand) {
  case 'list':
    console.log(
      `Generando tabla de multiplicar del 1 al ${limit} de base ${base}`,
    );
    listeTable(base, limit);
    break;
  case 'create':
    console.log(
      `Creando archivo de tabla de multiplicar del 1 al ${limit} de base ${base}`,
    );
    createFileTable(base, limit)
      .then(fileName => console.log(`Archivo creado: ${fileName}`))
      .catch(e => console.log(e));
    break;
  default:
    console.log('Comando invalido');
    break;
}
