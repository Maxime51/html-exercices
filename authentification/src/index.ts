import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";
import { clients } from "./listOfClients";
import { v4 as uuidv4 } from "uuid";

const app = express();
const formParser = express.urlencoded({ extended: true });

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(express.static("public")); //acces au dossier
app.set("view engine", "njk");

app.post("/add-connexion", formParser, (request, response) => {
  // request.body contains an object with our named fields
  let userFind = false;
  let uuid = "";
  clients.forEach((element) => {
    if (element.userName === request.body.username) {
      if (element.password === request.body.password) {
        userFind = true;
        uuid = uuidv4();
        element.uuid = uuid;
        console.log(element);
      } else {
        userFind = false;
      }
    }
  });
  //const idConnexionModif = `${idConnexion.substring(0, idConnexion.length - 1)},"premium":"${premium}"}`;
  if (userFind) {
    response.set(
      "Set-Cookie",
      cookie.serialize("id", uuid, {
        maxAge: 3600,
      }),
    );
    response.redirect("/");
  } else if (userFind === false) {
    response.set(
      "Set-Cookie",
      cookie.serialize("id", uuid, {
        maxAge: 0,
      }),
    );
    const msgErr = "Aucun utilisateur trouvé";
    response.render("home", { msgErr });
  }
});
//création de route
app.get("/", (request, response) => {
  const cookies = JSON.stringify(cookie.parse(request.get("cookie") || ""));
  console.log(cookies);
  const objCookies = JSON.parse(cookies);
  console.log(objCookies);
  let nameUser = "";
  let premium = false;
  let uuid = "";
  clients.forEach((element) => {
    if (element.uuid === objCookies.id) {
      nameUser = element.userName;
      premium = element.premium;
      uuid = element.uuid;
    }
  });
  response.render("home", { nameUser, premium, uuid });
});

app.get("/connexion", (request, response) => {
  response.render("connexion");
});
app.get("/layout", (request, response) => {
  console.log("hello");
  response.render("home");
});
app.get("/test", (request, response) => {
  const cookies = JSON.stringify(cookie.parse(request.get("cookie") || ""));
  const objCookies = JSON.parse(cookies);
  let nameUser = "";
  let premium = false;
  let uuid = "";
  clients.forEach((element) => {
    if (element.uuid === objCookies.id) {
      nameUser = element.userName;
      premium = element.premium;
      uuid = element.uuid;
    }
  });
  if (premium) {
    response.render("test", { nameUser, uuid });
  } else {
    response.render("home", { nameUser, uuid });
  }
});

//message connexion
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
