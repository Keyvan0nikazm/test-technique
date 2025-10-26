var express = require('express');
var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var intershipRouter = require('./routes/intership');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve OpenAPI / Swagger UI from docs/openapi.yaml
try {
  var openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
  var openapiDocument = yaml.load(fs.readFileSync(openapiPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
} catch (err) {
  console.warn('OpenAPI document not loaded:', err.message);
  app.get('/api-docs', function (req, res) {
    res.status(500).send('Documentation OpenAPI non disponible (vérifier docs/openapi.yaml)');
  });
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/intership', intershipRouter);

module.exports = app;
