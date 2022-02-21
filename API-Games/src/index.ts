import express from "express";
import nunjucks from "nunjucks";
import fetch from "node-fetch";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// declaration des variables utilisés par different bloc
let indexOfPage: number;
let indexPageGame: number;
let gamePlatforms: string[];
let listGames: string[];
let idPlatform: string;

app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

app.get("/", (req, response) => {
  response.render("home");
});

app.get("/options/:test", (req, response) => {
  const valueSelector = req.params.test;
  let selector: boolean;
  if (valueSelector === "platform") {
    selector = true;
  } else {
    selector = false;
  }

  getData("http://videogame-api.fly.dev/platforms").then((listOfPlatforms) => {
    response.render("home", { selector, listOfPlatforms });
  });
});

/************************************************************* */
//declaration functon Promise
/************************************************************* */

//function getNumberPages
function getNumberPages(url: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const arrayPage = fetch(url)
      .then((response) => response.json())
      .then((result) => result.total)
      .then((numberPage) => {
        const tab = [];
        for (let i = 1; i <= numberPage / 20 + 1; i++) {
          tab.push(i);
        }
        return tab;
      });
    if (arrayPage !== null) {
      resolve(arrayPage);
    } else {
      reject("error");
    }
  });
}
//function send list of platforms
function getData(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const listData = fetch(url).then((data) => data.json());
    if (listData !== null) {
      resolve(listData);
    } else {
      reject("error");
    }
  });
}

app.get("/platforms", (req, response) => {
  response.redirect(`platforms/1`);
});

//création de route home affiche liste plateformes
app.get("/platforms/:pages", (req, response) => {
  indexOfPage = parseInt(req.params.pages);
  getData(`http://videogame-api.fly.dev/platforms?page=${indexOfPage}`).then((platformsArray) => {
    getNumberPages("http://videogame-api.fly.dev/platforms").then((pages) => {
      response.render("platforms", {
        platforms: platformsArray.platforms,
        numberOFPagesArray: pages,
        indexOfPage,
      });
    });
  });
});

//route liste games plateforme
app.get("/platforms/games/:platform", (req, response) => {
  const stringRecup = req.params.platform;
  const stringRecupArray = stringRecup.split(":");
  response.redirect(`/games/${stringRecup}/1`);
});

//route liste games

app.get("/games", (req, response) => {
  response.redirect(`games/1`);
});

app.get("/games/:pages", (req, response) => {
  indexOfPage = parseInt(req.params.pages);

  getData(`http://videogame-api.fly.dev/games?page=${indexOfPage}`).then((listGames) => {
    getNumberPages("http://videogame-api.fly.dev/games").then((pages) => {
      response.render("games", {
        games: listGames.games,
        numberOFPagesGames: pages,
        indexOfPage,
        schearch: false,
      });
    });
  });
});

app.get("/games/:platform/:page", (req, response) => {
  gamePlatforms = [];
  idPlatform = "";
  idPlatform = req.params.platform;
  const stringRecupArray = idPlatform.split(":");
  indexPageGame = parseInt(req.params.page);

  getData(`http://videogame-api.fly.dev/games/platforms/${stringRecupArray[0]}?page=${indexPageGame}`).then(
    (gamePlatforms) => {
      getNumberPages(`http://videogame-api.fly.dev/games/platforms/${stringRecupArray[0]}`).then((pages) => {
        response.render("games", {
          gamePlatform: gamePlatforms.games,
          numberOFPagesGames: pages,
          idPlatform,
          indexPageGame,
          indexOfPage,
          pagePlatformOrigin: true,
          namePlatForm: stringRecupArray[1],
        });
      });
    },
  );
});

//route liste games plateforme afficher en page
app.get("/games/:platform/:name/:game", (req, response) => {
  const idPlatform = req.params.platform;
  const nameGame = req.params.name;
  const idGame = req.params.game;

  if (idPlatform === "game") {
    getData(`http://videogame-api.fly.dev/games/${idGame}`).then((gameInfo) => {
      getNumberPages("http://videogame-api.fly.dev/platforms").then((pages) => {
        response.render("games", {
          games: listGames,
          idPlatform,
          numberOFPagesGames: pages,
          gameInfo,
          afficheBloc: true,
          indexPageGame,
          indexOfPage,
        });
      });
    });
  } else {
    getData(`http://videogame-api.fly.dev/games/${idGame}`).then((gameInfo) => {
      getNumberPages("http://videogame-api.fly.dev/platforms").then((pages) => {
        response.render("games", {
          gamePlatform: gamePlatforms,
          idPlatform,
          numberOFPagesGames: pages,
          gameInfo,
          pagePlatformOrigin: true,
          afficheBloc: true,
          indexPageGame,
          indexOfPage,
        });
      });
    });
  }
});

//schearch

const formParser = express.urlencoded({ extended: true });

app.post("/schearch", formParser, (req, response) => {
  // request.body contains an object with our named fields
  const category = req.body.category;
  const nameGame = req.body.nameGame;
  const nameGameFormat = nameGame.split(" ").join("-");
  const nameGameFormatSlug = nameGameFormat.split(":").join("").toLowerCase();
  if (category === "name") {
    getData(`http://videogame-api.fly.dev/games/slug/${nameGameFormatSlug}`).then((game) => {
      getNumberPages("http://videogame-api.fly.dev/games").then((pages) => {
        response.render("games", {
          gameInfo: game,
          afficheBloc: true,
          schearch: true,
          pagePlatformOrigin: false,
        });
      });
    });
  } else if (category === "platform") {
    getData(`http://videogame-api.fly.dev/platforms`).then((platForms) => {
      const platFormSchearch = platForms.platforms.filter(
        (element: { id: string; name: string; slug: string; category: string; summary: string; logo: [] }) =>
          element.name === nameGame,
      );
      console.log(platFormSchearch[0].id);
      response.redirect(`/platforms/games/${platFormSchearch[0].id}`);
    });
  }
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
