'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const db = require('./_helpers/db')

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Hello from >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>></h1>');
  res.end();
});

router.use('/accounts', db.initialize, require('./auth/accounts/accounts.controller'));

router.get('/another', (req, res) => res.json({route: req.originalUrl}));
router.post('/', (req, res) => res.json({postBody: req.body}));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => {
  console.log("Serving index")
  return res.sendFile(path.join(__dirname, '../index.html'));
});

module.exports = app;
module.exports.handler = serverless(app);
