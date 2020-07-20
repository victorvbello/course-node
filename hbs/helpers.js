const hbs = require('hbs');

hbs.registerHelper('getYear', () => new Date().getFullYear());

hbs.registerHelper('capitalize', (text = '') => {
  return text
    .split(' ')
    .map(
      (word = '') =>
        word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase(),
    ).join(' ');
});
