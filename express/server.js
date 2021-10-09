'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const db = require('./_helpers/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const router = express.Router();
const configManager = require('./config-manager')
const errorHandler = require('./auth/_middleware/error-handler')
router.use(bodyParser.urlencoded({extended: false}));
router.use(cookieParser());

router.get('/', (req, res) => {
  res.send('<pre>Welcome to API root</pre>');
});

if (!process.env.IS_PROD) {
  const swaggerUi = require('swagger-ui-express');
  const YAML = require('yamljs');
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
router.use('/accounts', db.initialize, require('./auth/accounts/accounts.controller'));

router.get('/lol', (req, res) => res.json({route: req.originalUrl}));

const app = express();
app.disable('x-powered-by')
app.use(errorHandler);

app.use(cors({origin: (origin, callback) => callback(null, true), credentials: true}));
app.use(bodyParser.json());
app.use(configManager.getConfig().static.api_base_path, router);  // path must route through netlify lambda

module.exports = app;
module.exports.handler = serverless(app);
