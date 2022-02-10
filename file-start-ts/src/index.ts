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

//route articles
app.get("/blog/articles/:articleName", (request, response) => {
  const routeParameters = request.params;
  const article = routeParameters.articleName;

  response.render("blog", {});
});

app.get("/description", (request, response) => {
  response.render("description");
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
