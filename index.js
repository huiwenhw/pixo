const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const store = require("./store");
const app = express();

const cloudinary = require("cloudinary");
const config = require("./config").cloudinary;

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

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
      if (success) res.status(200).send({ success: success, userId: userId });
      else res.status(200).send({ success: success, error: error });
    });
});
app.get("/:userId/albums", (req, res) => {
  console.log("get request /:userId/albums");
  console.log(req.params);
  store
    .getAlbums({
      userId: req.params.userId
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
