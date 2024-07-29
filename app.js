const express = require('express');
const path = require('path');
const router = require('./src/routes/api');
const app = express();

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { dbConnection } = require('./src/configuration/config');
const errorHandler = require('./src/middlewares/errorHandler');

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// configure Cors policy
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https:://localhost:5173',
      'http://127.0.0.1:5173',
      'https://127.0.0.1:5173',
      'https://store-management-crm.netlify.app',
    ],
    credentials: true,
  })
);
// configure Cors policy

app.use(hpp());
app.use(mongoSanitize());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(
  '/api/v1/avatars',
  express.static(path.join(__dirname, 'src', 'uploads', 'avatars'))
);

// request rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});
app.use(limiter);
app.use(cookieParser(process.env.COOKIE_SECRET));

// Database connection
dbConnection();

app.use('/api/v1', router);

// Undefined route implement
app.use('*', (req, res) => {
  res.status(404).json({ Status: 'failed', data: 'Not found!' });
});

// default error handler middleware
app.use(errorHandler);

module.exports = app;
