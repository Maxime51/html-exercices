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

//création de route home
let numberOFPagesArray: number[] = [];
app.get("/", (req, response) => {
  request("http://videogame-api.fly.dev/platforms", (error, body) => {
    const listOfPlatforms = JSON.parse(body);
    for (let i = 1; i <= listOfPlatforms.total / 20 + 1; i++) {
      numberOFPagesArray.push(i);
    }
    response.render("home", { numberOFPagesArray });
  });
});

//création de route home affiche liste plateformes
app.get("/:pages", (req, response) => {
  const indexOfPage = req.params.pages;
  request(`http://videogame-api.fly.dev/platforms?page=${indexOfPage}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(body);
      response.render("home", { platforms: json.platforms, numberOFPagesArray, indexOfPage });
    }
  });
});

//route liste games plateforme
let numberOFPagesGames: number[] = [];
app.get("/games/:platform", (req, response) => {
  const stringRecup = req.params.platform;
  const arrayString = stringRecup.split("_");
  request(`http://videogame-api.fly.dev/games/platforms/${arrayString[0]}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const gamePlatform = JSON.parse(body);
      for (let i = 1; i <= gamePlatform.total / 20 + 1; i++) {
        numberOFPagesGames.push(i);
      }
      response.render("games", { numberOFPagesGames, idPlatform: arrayString[0], idPage: arrayString[1] });
    }
  });
});

//route liste games plateforme afficher en page
app.get("/games/:platform/:page", (req, response) => {
  const idPlatform = req.params.platform;
  const indexPage = req.params.page;
  request(`http://videogame-api.fly.dev/games/platforms/${idPlatform}?page=${indexPage}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const gamePlatforms = JSON.parse(body);
      response.render("games", { gamePlatform: gamePlatforms.games, idPlatform, numberOFPagesGames });
    }
  });
});

//route liste games plateforme afficher en page
app.get("/games/:platform/:page/:game", (req, response) => {
  const idPlatform = req.params.platform;
  const indexPage = req.params.page;
  const idGame = req.params.game;

  request(`http://videogame-api.fly.dev/games/platforms/${idPlatform}?page=${indexPage}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const gamePlatforms = JSON.parse(body);
      console.log(gamePlatforms);
      response.render("games", { gamePlatform: gamePlatforms.games, idPlatform, numberOFPagesGames });
    }
  });
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
