const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const store = require("./store");
const app = express();
const multer = require("multer");
const mkdirp = require("mkdirp");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

// Able to access req.body cause I assigned that first
// in the formData in App.js
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const newDest = `${__dirname}/client/public/photos/${req.body.userId}/${
      req.body.albumId
    }`;
    console.log(newDest);
    mkdirp(newDest, err => cb(err, newDest));
  },
  filename: function(req, file, cb) {
    let filename = file.originalname.replace(/\s/g, "_");
    console.log(filename);
    cb(null, filename);
  }
});
const upload = multer({ storage });

app.post("/user", (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200));
});
app.post("/login", (req, res) => {
  console.log(req);
  console.log(req.body);
  store
    .authenticate({
      username: req.body.username,
      password: req.body.password
    })
    .then(({ success, userId }) => {
      if (success) res.status(200).send({ userId: userId });
      else res.sendStatus(401);
    });
});
app.post("/albums", upload.single("file"), (req, res) => {
  console.log("post request /albums");
  console.log(req.body);
  console.log(req.file);
  let filename = req.file.originalname.replace(/\s/g, "_");
  store
    .createAlbum({
      title: req.body.title,
      desc: req.body.desc,
      cover: `/photos/${req.body.userId}/${req.body.albumId}/${filename}`,
      userId: req.body.userId
    })
    .then(({ albumId }) => {
      res.status(200).send({ albumId: albumId });
    });
});
app.post("/uploadPhotos", upload.array("files", 10), (req, res) => {
  console.log("post req /photos");
  console.log(req.body);
  console.log(req.files);
  let userId = req.body.userId;
  let albumId = req.body.albumId;
  let photos = req.files.map(file => {
    let filename = file.originalname.replace(/\s/g, "_");
    return {
      name: filename,
      description: "",
      path: `/photos/${userId}/${albumId}/${filename}`,
      album_id: albumId
    };
  });
  store.uploadPhotos(photos).then(() => res.sendStatus(200));
});
app.get("/getAlbumId", (req, res) => {
  store.getAlbumId().then(({ albumId }) => {
    res.status(200).send({ albumId: albumId });
  });
});
app.get("/:userid/albums", (req, res) => {
  console.log("get request /:userid/albums");
  console.log(req.params);
  store
    .getAlbums({
      userId: req.params.userid
    })
    .then(({ albums }) => {
      res.status(200).send({ albums: albums });
    });
});
app.get("/:albumid/getPhotos", (req, res) => {
  console.log("get request /:albumid/getPhotos");
  console.log(`photos ${req.params}`);
  store
    .getPhotos({
      albumId: req.params.albumid
    })
    .then(({ photos }) => {
      console.log("photos");
      console.log(photos);
      res.status(200).send({ photos: photos });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
