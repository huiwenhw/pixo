const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const store = require("./store");
const app = express();
const multer = require("multer");
const multerMultiple = require("multer");
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
    // console.log(req.body);
    mkdirp(newDest, err => cb(err, newDest));
  },
  filename: function(req, file, cb) {
    cb(null, `cover${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const storageMultiple = multerMultiple.diskStorage({
  destination: function(req, file, cb) {
    const newDest = `${__dirname}/client/public/photos/${req.body.userId}/${
      req.body.albumId
    }`;
    // console.log(req.body);
    mkdirp(newDest, err => cb(err, newDest));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname.replace(/\s/g, "_"));
  }
});
const uploadMultiple = multerMultiple({ storageMultiple });

app.post("/createUser", (req, res) => {
  store
    .createUser({
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.sendStatus(200));
});
app.post("/login", (req, res) => {
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
app.post("/createAlbum", upload.single("file"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  store
    .createAlbum({
      title: req.body.title,
      desc: req.body.desc,
      cover: `/photos/${req.body.userId}/${
        req.body.albumId
      }/cover${path.extname(req.file.originalname)}`,
      userId: req.body.userId
    })
    .then(({ albumId }) => {
      res.status(200).send({ albumId: albumId });
    });
});
app.post("/uploadPhotos", uploadMultiple.array("files", 10), (req, res) => {
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
app.post("/albums", (req, res) => {
  console.log(req.body);
  store
    .getAlbums({
      userId: req.body.userId
    })
    .then(({ albums }) => {
      res.status(200).send({ albums: albums });
    });
});
app.post("/getAlbumPhotos", (req, res) => {
  console.log(req.body);
  store
    .getAlbumPhotos({
      albumId: req.body.albumId
    })
    .then(({ photos }) => {
      res.status(200).send({ photos: photos });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
