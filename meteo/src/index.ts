import express from "express";
import nunjucks from "nunjucks";
import request from "@fewlines-education/request";
import "dotenv/config";
import cookie from "cookie";

const app = express();
const formParser = express.urlencoded({ extended: true });

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

//création de route
app.get("/", (req, response) => {
  response.render("home");
});

function iconeMeteo(weather: string) {
  if (weather === "clear sky") {
    return "https://openweathermap.org/img/wn/01d.png";
  } else if (weather === "scattered clouds") {
    return "https://openweathermap.org/img/wn/02d.png";
  } else if (weather === "overcast clouds") {
    return "https://openweathermap.org/img/wn/03d.png";
  } else if (weather === "broken clouds") {
    return "https://openweathermap.org/img/wn/04d.png";
  } else if (weather === "shower rain") {
    return "https://openweathermap.org/img/wn/09d.png";
  } else if (weather === "moderate rainc") {
    return "https://openweathermap.org/img/wn/09d.png";
  } else if (weather === "light rain") {
    return "https://openweathermap.org/img/wn/09d.png";
  } else if (weather === "rain") {
    return "https://openweathermap.org/img/wn/10d.png";
  } else if (weather === "thunderstorm") {
    return "https://openweathermap.org/img/wn/11d.png";
  } else if (weather === "snow") {
    return "https://openweathermap.org/img/wn/13d.png";
  } else if (weather === "mist") {
    return "https://openweathermap.org/img/wn/50d.png";
  }
}
app.post("/treatForm", formParser, (req, response) => {
  // request.body contains an object with our named fields
  const city = req.body.city;

  request(
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`,
    (error, html) => {
      if (error) {
        console.error(error);
      } else {
        const json = JSON.parse(html);
        const objectDetail = json.list.map(
          (element: { dt_txt: string; main: { temp: string }; weather: { description: any }[] }) => {
            return {
              date: element.dt_txt.split(" ")[0].split("-").reverse().join("/"),
              hour: element.dt_txt.split(" ")[1],
              temperature: element.main.temp + " °C",
              icone: iconeMeteo(element.weather[0].description),
              weather: element.weather[0].description,
            };
          },
        );
        response.render("meteo", { objectDetail, city });
      }
    },
  );
});

app.get("/meteo", (req, response) => {
  const cookies = cookie.parse(req.get("cookie") || "");
  console.log();
  response.render("meteo");
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
