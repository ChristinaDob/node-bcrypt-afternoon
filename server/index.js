require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const ac = require('./controllers/authController');

const PORT = 4000;

const { CONNECTION_STRING, SESSION_SECRET } = process.env;

const app = express();

app.use(bodyParser.json());

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log(`Connected to my database`);
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  })
);

app.post('/auth/register', ac.register);

app.post('/auth/login', ac.login);

app.post('/auth/login', ac.login);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
