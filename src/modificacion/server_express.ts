import express from "express";
import request from "request";

const app = express();

app.get("/weather", (req, res) => {
  if (!req.query.location) {
    return res.status(400).send({
      error: "You must provide a location",
    });
  }
  const location = req.query.location as string;
  const url = `http://api.weatherstack.com/current?access_key=9376141fdd275dd807c18e0c0d116220&query=${location}`;
  request({ url, json: true }, (error, response) => {
    if (error) {
      res.status(500).send({ error: "Unable to connect to weather service!" });
    } else if (response.body.error) {
      res.status(400).send({ error: "Unable to find location" });
    } else {
      res.send(response.body);
    }
  });
});

app.get("*", (req, res) => {
  res.status(404).send({ errror: "404 - Not found" });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
