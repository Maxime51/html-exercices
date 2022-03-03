import express from "express";
import "dotenv/config";
import { Db, MongoClient, ObjectId } from "mongodb";
import nunjunks from "nunjucks";

const app = express();

nunjunks.configure("views", {
  autoescape: true,
  express: app,
});

// declaration type
type Film = {
  _id: ObjectId;
  title: string;
  annee: number;
  realisateur: ObjectId;
  genre: ObjectId;
  url: string;
  acteurs: ObjectId[];
  sortie: string;
};
type Realisateur = {
  _id: ObjectId;
  lastName: string;
  firstName: string;
  url: string;
  films: ObjectId[];
};
type Genre = {
  _id: ObjectId;
  name: string;
};
type Id = {
  _id: ObjectId;
};
type Acteur = {
  _id: ObjectId;
  lastName: string;
  firstName: string;
  yearOfBirth: number;
  films: ObjectId[];
  url: string;
};
//connexion à la db
const databaseUrl = process.env.MONGODB_DATABASE_URL || "";
const client = new MongoClient(databaseUrl);

client.connect().then((client) => {
  const db = client.db();

  /*db.collection<Film>("Films")
    .find()
    .toArray()
    .then((films) => {
      films.forEach((film) => {
        db.collection<Realisateur>("Realisateurs")
          .findOne({ _id: film.realisateur })
          .then((resultRealisateur) => {
            db.collection<Genre>("Genres")
              .findOne({ _id: film.genre })
              .then((resultGenre) => {
                db.collection<Acteur>("Acteurs")
                  .find({ films: film._id })
                  .toArray()
                  .then((resultActeur) => {
                    console.log({
                      _id: film._id,
                      title: film.title,
                      genre: resultGenre,
                      annee: film.annee,
                      realisateur: resultRealisateur,
                      acteurs: resultActeur,
                    });
                  });
              });
          });
      });
    });*/

  //load database in /films
  app.get("/films", (req, response) => {
    db.collection("Genres")
      .find()
      .toArray()
      .then((dataGenres) => {
        db.collection("Annees")
          .find()
          .toArray()
          .then((dataAnnees) => {
            response.render("films", { dataAnnees, dataGenres });
          });
      });
  });

  app.get("/films/:genreSlug", async (req, response) => {
    const genreSelected = new ObjectId(req.params.genreSlug);
    console.log(genreSelected);

    const films = await db.collection<Film>("Films").find({ genre: genreSelected }).toArray();

    console.log(films);
    response.render("films", { data: films });
  });

  //load database in /films
  app.get("/series", (req, response) => {
    db.collection("Genres")
      .find()
      .toArray()
      .then((dataGenres) => {
        db.collection("Annees")
          .find()
          .toArray()
          .then((dataAnnees) => {
            response.render("series", { dataAnnees, dataGenres });
          });
      });
  });
});

app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

//routes simples
app.get("/", (req, response) => {
  response.render("home");
});

app.get("/series", (req, response) => {
  response.render("series");
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
