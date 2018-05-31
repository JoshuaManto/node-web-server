const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port =process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// next exists so you can tell express when middleware function is done
app.use((req, res, next) =>
{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) =>
  {
    if (err)
    {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// MAINTENANCE MIDDLEWARE
// app.use((req, res, next) =>
// {
//   res.render('maintenance.hbs',
//   {
//     maintenanceMessage: 'We are currently in maintenance!',
//   });
// });

// static takes absolute path
// how to register middleware
app.use(express.static(__dirname + '/public'));

// 2 arguments - name and function to run
hbs.registerHelper('getCurrentYear', () =>
{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>
{
  return text.toUpperCase();
});

// request - stores ton of info about request coming in. Things like headers used, body info, method that was made with request to the path
// respond - bunch of methods to respond to the http request. Can customize data send back and set http status codes and more
app.get('/', (req, res) =>
{
  // res.send('<h1>Hello Express!</h1>');
  // Other possible uses inject dynamic user data like username or email or anything else
  res.render('home.hbs',
  {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the Home Page!'
  });
});

app.get('/about', (req, res) =>
{
  res.render('about.hbs',
  {
    pageTitle: 'About Page',
  });

});

app.get('/bad', (req, res) =>
{
  res.send({
      errorMessage: 'Unable to fulfill this request'
    }
  );
});

// will be changed depending on the server
// can take 2nd arguments. It is a function
app.listen(port, () =>
{
  console.log(`Server is up on port ${port}`);
});
