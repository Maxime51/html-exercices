import express from "express";
import nunjucks from "nunjucks";

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

//création de route
app.get("/", (request, response) => {
  response.render("home");
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
