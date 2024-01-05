const _ = require('lodash');

// Use raw json value as database 
const eventsData = require('./data/data.json');

module.exports = (startDate, endDate, vehicleId) => new Promise((resolve, reject) => {

  // Validate input parameters
  if (!startDate || !endDate || !vehicleId) {
    return reject('Missing required parameters');
  }

  // Validate date format
  const iso8601Regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)Z$/;
  if (!iso8601Regex.test(startDate) || !iso8601Regex.test(endDate)) {
    return reject('Invalid date format');
  }

  // Convert to timestamp
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();

  // If endDate is earlier than startDate, it's an invalid input
  if (endTime < startTime) {
    return reject("Invalid input parameters, 'endDate' is earlier than 'startDate'");
  }

  // Filter and sort events data by vehicleId
  const filteredEvents = _.chain(eventsData)
    .filter((event) => event.vehicleId === vehicleId)
    .sortBy('timestamp')
    .value();

  // Add virtual events to the first and last of events for interval calcuation
  filteredEvents.unshift({ timestamp: -Infinity, event: 'no_data' });
  filteredEvents.push({ timestamp: Infinity, event: 'no_data' });

  // Find first and last index of event in interval (startTime, endTime)
  // The ideal one is startTime < firstEvent < lastEvent < endTime
  const firstEventIndex = _.findIndex(filteredEvents, (event) => event.timestamp > startTime);
  const lastEventIndex = _.findLastIndex(filteredEvents, (event) => event.timestamp < endTime);

  // Calcuate result
  const result = [];

  // Add intervals from firstEvent to lastEvent 
  for (let fromIndex = firstEventIndex; fromIndex < lastEventIndex;) {

    for (let toIndex = fromIndex + 1; toIndex <= lastEventIndex; toIndex++) {
      // Find the first different event or timestamp
      if (
        toIndex === lastEventIndex ||
        !(
          filteredEvents[toIndex].event === filteredEvents[fromIndex].event ||
          filteredEvents[toIndex].timestamp === filteredEvents[fromIndex].timestamp
        )
      ) {
        // Add interval [fromIndex, toIndex] to result
        result.push({
          event: filteredEvents[fromIndex].event,
          from: filteredEvents[fromIndex].timestamp,
          to: filteredEvents[toIndex].timestamp,
        });

        fromIndex = toIndex;
        break;
      }
    }
  }

  if (firstEventIndex > lastEventIndex) {
    // In case of lastEvent < startTime < endTime < firstEvent
    result.push({
      event: filteredEvents[lastEventIndex].event,
      from: startTime,
      to: endTime,
    });
  } else {
    // In case of startTime < firstEvent < lastEvent < endTime

    // Insert interval [startTime, firstEvent] to the first
    result.unshift({
      event: filteredEvents[firstEventIndex - 1].event,
      from: startTime,
      to: filteredEvents[firstEventIndex].timestamp,
    });

    // Insert interval [lastEvent, endTime] to the last
    result.push({
      event: filteredEvents[lastEventIndex].event,
      from: filteredEvents[lastEventIndex].timestamp,
      to: endTime,
    });
  }

  return resolve(result);
});
