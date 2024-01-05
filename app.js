const express = require('express');
const logger = require('morgan');

// Use raw json value as database 
const eventsData = require('./data/data.json');
const processQuery = require('./processQuery');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Handle GET requests to the root endpoint
 * 
*/
app.get('/', (req, res) => {
  // Respond with JSON containing eventsData
  res.json(eventsData);
});

/**
 * Handle all HTTP methods for the '/query' endpoint
 * Input params: startDate, endDate, vehicleId
 * 
*/
app.all('/query', (req, res) => {
  // Input parameters
  // Use query parameters or request body values for startDate, endDate, and vehicleId
  const startDate = req.query.startDate || req.body.startDate || '2023-12-16T00:44:22Z';
  const endDate = req.query.endDate || req.body.endDate || '2023-12-16T02:51:00Z';
  const vehicleId = req.query.vehicleId || req.body.vehicleId || 'sprint-5';

  processQuery(startDate, endDate, vehicleId)
    .then(data => res.json(data))
    .catch(error => res.status(400).json({
      error,
      request: {
        startDate,
        endDate,
        vehicleId
      }
    }));
});

module.exports = app;
