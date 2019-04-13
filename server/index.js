require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const ac = require('./controllers/authController');
const treasureController = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

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

app.get('/auth/logout', ac.logout);

app.get('/api/treasure/dragon', treasureController.dragonTreasure);

app.get(
  '/api/treasure/user',
  auth.usersOnly,
  treasureController.getUserTreasure
);

app.post(
  '/api/treasure/user',
  auth.usersOnly,
  treasureController.addUserTreasure
);

app.get(
  '/api/treasure/all',
  auth.usersOnly,
  auth.adminsOnly,
  treasureController.getAllTreasure
);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
