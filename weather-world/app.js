require('dotenv').config();

const yargs = require('yargs');
const colors = require('colors');

const place = require('./place/places');
const weather = require('./weather/weather');

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

const { address = '' } = argv;

console.log(colors.yellow(`Process address <${address}>`));

const getInfo  = async ( addressToFind = '' ) => {
  const placeData = await place.getLatLong(addressToFind);
  if(!placeData){
    return colors.red("Can't find the city");
  }
  const { address: lastAddress = '', lat = 0, lon = 0 } = placeData;
  if(!lat || !lon) {
    return colors.red("Invalid latitude / longitude");
  }
  const weatherData = await weather.getWeather(lat, lon)
  if(!weatherData){
    return (colors.red(`Can't find the weather of ${lastAddress}`));
  }
  const { temp = 0 }  = weatherData;
  return colors.bgGreen.black(`The weather of ${lastAddress} is ${temp}º `);
}


getInfo(address)
  .then(console.log)
  .catch(console.log)


