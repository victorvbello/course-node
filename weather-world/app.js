require('dotenv').config();

const yargs = require('yargs');
const colors = require('colors');
const got = require('got');

const argv = yargs
  .options({
    address: {
      alias: 'a',
      description: 'City address to get weather',
      demandOption: true,
    },
  })
  .help().argv;

console.log(colors.green('Weather world app  is running'));

const { address } = argv;

const addressEncode = encodeURI(address);

const clientGot = got.extend({
  prefixUrl:
    'https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
  },
});

clientGot
  .get('', {
    searchParams: `location=${addressEncode}`,
  })
  .then(resp => {
    const { body = '' } = resp;
    const bodyObject = JSON.parse(body);
    const { Results = [] } = bodyObject;
    const [firstResult = {}] = Results;
    console.log(firstResult);
  })
  .catch(err => {
    console.log('Error', err);
  });

console.log(address);
