import express from 'express';
import { weatherInfo } from './weather';

const app = express();

app.get('/weather', (req, res) => {
  const location = req.query.location;
  weatherInfo(location as string, (error, data) => {
    if (error) {
      res.send({ error });
    } else {
      res.send({ data });
    }
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});