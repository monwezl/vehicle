# Vehicle Status Timeline API

This Node.js application provides an API for transforming sample vehicle status data into a sequence of intervals for display on a timeline.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/monwezl/vehicle.git
   ```

2. **Install dependencies:**

   ```bash
   npm install or yarn
   ```

3. **Install dependencies:**
   ```bash
   npm start or yarn start
   ```

## Usage

### Retrieve All Events

- Endpoint: /
- Method: GET
- Description: Get all events data.
- Input Parameters
- Response Format
  The response is an array of intervals in the format.

  ```
  { id, timestamp, vehicleId, event}
  ```

### Retrieve Vehicle Status Intervals

- Endpoint: /query
- Method: ALL
- Description: Transform sample data into intervals for a given vehicle ID within a specified time range.

- Input Parameters

  - startDate (optional): Start date & time in UTC (ISO8601 format).
  - endDate (optional): End date & time in UTC (ISO8601 format).
  - vehicleId (optional): Vehicle ID.

- Response Format
  The response is an array of intervals in the format.
  ```
  { event, from, to }
  ```

## Example

Retrieve all events:

```bash
curl http://localhost:3000/
```

Retrieve vehicle status intervals:

```bash
curl -X ALL -d "startDate=2023-12-16T00:44:22Z&endDate=2023-12-16T02:51:00Z&vehicleId=sprint-5" http://localhost:3000/query
```

## License

This project is licensed under the MIT License.
