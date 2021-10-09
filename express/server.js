'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const db = require('./_helpers/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

router.use(bodyParser.urlencoded({extended: false}));
router.use(cookieParser());

router.get('/', (req, res) => {
  res.send('<pre>Welcome to API root</pre>');
});


const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/accounts', db.initialize, require('./auth/accounts/accounts.controller'));

router.get('/lol', (req, res) => res.json({route: req.originalUrl}));

const app = express();
app.use(cors({origin: (origin, callback) => callback(null, true), credentials: true}));
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route through netlify lambda
app.use('/', express.static(path.join(__dirname, '../')));


module.exports = app;
module.exports.handler = serverless(app);
