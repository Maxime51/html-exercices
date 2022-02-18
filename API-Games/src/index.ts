import express from "express";
import nunjucks from "nunjucks";
import request from "@fewlines-education/request";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
// declaration des variables utilisés par different bloc
let indexOfPage: number;
let games: [];
let indexPageGame: number;
let gamePlatforms: string[];
let listGames: string[];
let idPlatform: string;

app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

app.get("/", (req, response) => {
  response.render("home");
});

//création de route home
let numberOFPagesArray: number[] = [];
app.get("/platforms", (req, response) => {
  request("http://videogame-api.fly.dev/platforms", (error, body) => {
    const listOfPlatforms = JSON.parse(body);
    numberOFPagesArray = [];
    for (let i = 1; i <= listOfPlatforms.total / 20 + 1; i++) {
      numberOFPagesArray.push(i);
    }
    response.redirect(`platforms/1`);
  });
});

//création de route home affiche liste plateformes
app.get("/platforms/:pages", (req, response) => {
  indexOfPage = parseInt(req.params.pages);
  request(`http://videogame-api.fly.dev/platforms?page=${indexOfPage}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(body);
      response.render("platforms", { platforms: json.platforms, numberOFPagesArray, indexOfPage });
    }
  });
});

//route liste games plateforme
let numberOFPagesGames: number[] = [];
app.get("/platforms/games/:platform", (req, response) => {
  const stringRecup = req.params.platform;
  const stringRecupArray = stringRecup.split(":");
  request(`http://videogame-api.fly.dev/games/platforms/${stringRecupArray[0]}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const gamePlatform = JSON.parse(body);
      numberOFPagesGames = [];
      for (let i = 1; i <= gamePlatform.total / 20 + 1; i++) {
        numberOFPagesGames.push(i);
      }
      response.redirect(`/games/${stringRecup}/1`);
    }
  });
});

//route liste games

app.get("/games", (req, response) => {
  request("http://videogame-api.fly.dev/games", (error, body) => {
    const listOfPlatGames = JSON.parse(body);
    numberOFPagesArray = [];
    for (let i = 1; i <= listOfPlatGames.total / 20 + 1; i++) {
      numberOFPagesArray.push(i);
    }
    response.redirect(`games/1`);
  });
});
app.get("/games/:pages", (req, response) => {
  indexOfPage = parseInt(req.params.pages);
  request(`http://videogame-api.fly.dev/games?page=${indexOfPage}`, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      const json = JSON.parse(body);
      listGames = json.games;
      response.render("games", { games: json.games, numberOFPagesGames: numberOFPagesArray, indexOfPage });
    }
  });
});

app.get("/games/:platform/:page", (req, response) => {
  gamePlatforms = [];
  idPlatform = "";
  idPlatform = req.params.platform;
  const stringRecupArray = idPlatform.split(":");
  indexPageGame = parseInt(req.params.page);
  request(
    `http://videogame-api.fly.dev/games/platforms/${stringRecupArray[0]}?page=${indexPageGame}`,
    (error, body) => {
      if (error) {
        console.error(error);
      } else {
        gamePlatforms = JSON.parse(body).games;
        response.render("games", {
          gamePlatform: gamePlatforms,
          idPlatform,
          numberOFPagesGames,
          schearch: true,
          indexOfPage,
          pagePlatformOrigin: true,
          indexPageGame,
          namePlatForm: stringRecupArray[1],
        });
      }
    },
  );
});

//route liste games plateforme afficher en page
app.get("/games/:platform/:name/:game", (req, response) => {
  const idPlatform = req.params.platform;
  const nameGame = req.params.name;
  const idGame = req.params.game;

  if (idPlatform === "game") {
    request(`http://videogame-api.fly.dev/games/${idGame}`, (error, body) => {
      if (error) {
        console.error(error);
      } else {
        const gameInfo = JSON.parse(body);
        response.render("games", {
          games: listGames,
          idPlatform,
          numberOFPagesGames: numberOFPagesArray,
          gameInfo,
          afficheBloc: true,
          indexPageGame,
          indexOfPage,
        });
      }
    });
  } else {
    request(`http://videogame-api.fly.dev/games/${idGame}`, (error, body) => {
      if (error) {
        console.error(error);
      } else {
        const gameInfo = JSON.parse(body);
        response.render("games", {
          gamePlatform: gamePlatforms,
          idPlatform,
          numberOFPagesGames,
          gameInfo,
          pagePlatformOrigin: true,
          afficheBloc: true,
          indexPageGame,
          indexOfPage,
        });
      }
    });
  }
});

//schearch

const formParser = express.urlencoded({ extended: true });

app.post("/schearch", formParser, (req, response) => {
  // request.body contains an object with our named fields
  const category = req.body.category;
  const nameGame = req.body.nameGame;
  if (category === "name") {
    const nameGameFormat = nameGame.split(" ").join("-");
    const nameGameFormatSlug = nameGameFormat.split(":").join("").toLowerCase();
    request(`http://videogame-api.fly.dev/games/slug/${nameGameFormatSlug}`, (error, body) => {
      if (error) {
        console.error(error);
      } else {
        const game = JSON.parse(body);
        response.render("games", { gameInfo: game, afficheBloc: true, schearch: true, pagePlatformOrigin: false });
      }
    });
  } else if (category === "platform") {
    request(`http://videogame-api.fly.dev/platforms`, (error, body) => {
      if (error) {
        console.error(error);
      } else {
        const platForms = JSON.parse(body);
        const platFormSchearch = platForms.platforms.filter(
          (element: { id: string; name: string; slug: string; category: string; summary: string; logo: [] }) =>
            element.name === nameGame,
        );
        response.redirect(`/platforms/games/${platFormSchearch[0].id}`);
      }
    });
  }
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
