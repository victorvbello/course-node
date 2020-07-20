const express = require('express');
const app = express();
const hbs = require('hbs');

require('./hbs/helpers');


const { PORT = 3000 } = process.env;

app.use(express.static(`${__dirname}/public`));

// Express HBS engine
app.set('view engine', 'hbs');
hbs.registerPartials(`${__dirname}/views/partials`)

app.get('/', (req, res) => {
  res.render('home', {
    name: 'viCtor beLLo',
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});


app.listen(PORT);
