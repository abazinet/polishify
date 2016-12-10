// init projects 
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express(); 
 
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
listener = app.listen(process.env.PORT || 80, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
 