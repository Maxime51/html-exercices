import express from "express";
import nunjucks from "nunjucks";
import request from "@fewlines-education/request";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

//Planets route
let listOfPlanets: any;
app.get("/Planets", (req, response) => {
  request("https://swapi.dev/api/planets", (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      listOfPlanets = json.results;
      response.render("Planets", { planets: json.results });
    }
  });
});
app.get("/Planets/:url", (req, response) => {
  const indexOfPlanet = req.params.url.split("'")[1];
  request(`https://swapi.dev/api/planets/${indexOfPlanet}`, (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      console.log(json);
      response.render("Planets", { planets: listOfPlanets, planetDetail: json });
    }
  });
});

//People route
let listOfPeople: any;
app.get("/People", (req, response) => {
  request("https://swapi.dev/api/people", (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      listOfPeople = json.results;
      response.render("People", { peoples: json.results });
    }
  });
});
app.get("/People/:url", (req, response) => {
  const indexOfPeople = req.params.url.split("'")[1];
  request(`https://swapi.dev/api/people/${indexOfPeople}`, (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      const indexOfPlanet = json.homeworld.split("/").reverse()[1];
      response.render("People", { peoples: listOfPeople, peopleDetail: json, indexOfPlanet });
    }
  });
});

//Spaceships route
let listOfSpaceships: any;
app.get("/Spaceships", (req, response) => {
  request("https://swapi.dev/api/starships", (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      listOfSpaceships = json.results;
      response.render("Spaceships", { spaceships: json.results });
    }
  });
});
app.get("/Spaceships/:url", (req, response) => {
  const indexOfPlanet = req.params.url.split("'")[1];
  request(`https://swapi.dev/api/starships/${indexOfPlanet}`, (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      response.render("Spaceships", { spaceships: listOfSpaceships, spaceshipDetail: json });
    }
  });
});

//Vehicules route
let listOfVehicules: any;
app.get("/Vehicules", (req, response) => {
  request("https://swapi.dev/api/vehicles", (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      listOfVehicules = json.results;
      response.render("Vehicules", { vehicules: json.results });
    }
  });
});
app.get("/Vehicules/:url", (req, response) => {
  const indexOfPlanet = req.params.url.split("'")[1];
  request(`https://swapi.dev/api/vehicles/${indexOfPlanet}`, (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      response.render("Vehicules", { vehicules: listOfVehicules, vehiculeDetail: json });
    }
  });
});

//Films route
let listOfFilms: any;
app.get("/Films", (req, response) => {
  request("https://swapi.dev/api/films", (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      listOfFilms = json.results;
      response.render("Films", { films: json.results });
    }
  });
});
app.get("/Films/:url", (req, response) => {
  const indexOfPlanet = req.params.url.split("'")[1];
  request(`https://swapi.dev/api/films/${indexOfPlanet}`, (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      response.render("Films", { films: listOfFilms, filmDetail: json });
    }
  });
});

//Species route
let listOfSpecies: any;
app.get("/Species", (req, response) => {
  request("https://swapi.dev/api/species", (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      listOfSpecies = json.results;
      response.render("Species", { species: json.results });
    }
  });
});
app.get("/Species/:url", (req, response) => {
  const indexOfPlanet = req.params.url.split("'")[1];
  request(`https://swapi.dev/api/species/${indexOfPlanet}`, (error, html) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(html);
      const indexOfPlanet = json.homeworld.split("/").reverse()[1];
      response.render("Species", { species: listOfSpecies, speciesDetail: json, indexOfPlanet });
    }
  });
});

//création de route
app.get("/", (req, response) => {
  response.render("home");
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
function item(item: any) {
  throw new Error("Function not implemented.");
}
