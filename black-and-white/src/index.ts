import express from "express";
import nunjucks from "nunjucks";
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
app.get("/", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  console.log(cookies);
  const color = cookies.colorModeCookie.split(":")[1].split('"');
  const colorSend = color[1];
  let colorBlack = "";
  let colorWhite = "";
  if (colorSend === "#000000") {
    colorBlack = "#000000";
  } else if (colorSend === "#FFFFFF") {
    colorWhite = "#FFFFFF";
  }
  response.render("home", { colorBlack, colorWhite });
});

app.post("/handle-form", formParser, (request, response) => {
  // request.body contains an object with our named fields
  const colorModeCookie = JSON.stringify(request.body);
  response.set(
    "Set-Cookie",
    cookie.serialize("colorModeCookie", colorModeCookie, {
      maxAge: 3600,
    }),
  );

  response.redirect("/");
  //response.redirect("layout");
});

app.get("/options", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  const color = cookies.colorModeCookie.split(":")[1].split('"');
  const colorSend = color[1];
  let colorBlack = "";
  let colorWhite = "";
  if (colorSend === "#000000") {
    colorBlack = "#000000";
  } else if (colorSend === "#FFFFFF") {
    colorWhite = "#FFFFFF";
  }
  response.render("options", { colorBlack, colorWhite });
});
//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
