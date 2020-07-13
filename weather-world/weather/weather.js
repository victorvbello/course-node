const got = require('got');
const colors = require('colors');

const httpErrorMsg = {
  '404': 'lat and lon not fount',
};

const getWeather = async (lat = 0, lon = 0) => {
  const clientGot = got.extend({
    prefixUrl: 'https://community-open-weather-map.p.rapidapi.com/',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    },
  });

  const result = await clientGot
    .get('weather', {
      searchParams: {
        lat,
        lon,
        units: 'metric',
      },
    })
    .catch((err) => {
      const { response: { statusCode = 0 } = {} } = err;
      const errorMsg = httpErrorMsg[statusCode] || '';
      if (errorMsg) {
        console.log(colors.red(`Error ${errorMsg}`));
        return;
      }
      console.log(colors.red('Error'), err);
    });

  if (!result) {
    return null;
  }

  const { body = '' } = result;
  const bodyObject = JSON.parse(body);
  const { main: { temp = 0 } = {} } = bodyObject;
  return {
    temp,
  };
};

module.exports = {
  getWeather,
};
