import request from "request";

export const weatherInfo = (
  location: string,
  callback: (error: string | undefined, data: any) => void
) => {
  const url = `http://api.weatherstack.com/current?access_key=9376141fdd275dd807c18e0c0d116220&query=${location}`;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (response.body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(undefined, response);
    }
  });
};
