const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const store = require("./store");
const session = require("express-session");
const app = express();

const cloudinary = require("cloudinary");
const config = require("./config").cloudinary;

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
});

//use sessions for tracking logins
app.use(
  session({
    secret: "something",
    resave: true,
    saveUninitialized: false
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    let err = new Error("You must be logged in to view this page.");
    err.status = 401;
    return next(err);
  }
}

app.get("/user", (req, res) => {
  console.log("checking if user is logged in");
  if (req.session.userId) {
    res.status(200).send({ loggedIn: true });
  } else {
    res.status(200).send({ loggedIn: false });
  }
});
app.post("/user", (req, res) => {
  console.log("post request /user");
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ success, error, userId }) => {
      console.log(success, error, userId);
      if (success) res.status(200).send({ success: success, userId: userId });
      else res.status(200).send({ success: success, error: error });
    });
});
app.post("/login", (req, res) => {
  console.log("post request /login");
  store
    .authenticate({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ success, error, userId }) => {
      req.session.userId = userId;
      if (success) res.status(200).send({ success: success, userId: userId });
      else res.status(200).send({ success: success, error: error });
    });
});
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
app.get("/albums", requiresLogin, (req, res) => {
  console.log("get request /albums");
  store
    .getAlbums({
      userId: req.session.userId
    })
    .then(({ albumId, albums }) => {
      res.status(200).send({ albumId: albumId, albums: albums });
    });
});
app.get("/album/:albumId", (req, res) => {
  console.log("get /album/:albumId");
  console.log(req.params);
  store
    .getAlbum({
      albumId: req.params.albumId
    })
    .then(({ album, photos }) => {
      console.log(album);
      res.status(200).send({ album: album, photos: photos });
    });
});
app.post("/album", (req, res) => {
  console.log("post request /albums");
  console.log(req.body);
  store
    .createAlbum({
      title: req.body.title,
      desc: req.body.desc,
      cover: req.body.filepath,
      userId: req.body.userId,
      filename: req.body.filename
    })
    .then(() => {
      res.sendStatus(200);
    });
});
app.post("/photos", (req, res) => {
  console.log("post req /photos");
  console.log(req.body);
  let albumId = req.body.albumId;
  let photos = req.body.files.map(file => {
    console.log(file);
    return {
      name: file.name,
      description: "",
      path: file.path,
      album_id: albumId
    };
  });
  store.uploadPhotos(photos).then(() => res.sendStatus(200));
});

// Error handler
app.use(function(err, req, res, next) {
  console.log("hi");
  console.log(err.status);
  console.log(err.message);
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
