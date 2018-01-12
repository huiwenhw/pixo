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

const storage = multer.diskStorage({
  // destination: __dirname + "/albums",
  destination: function(req, file, cb) {
    const newDest = `${__dirname}/albums/${req.body.user_id}/${
      req.body.album_id
    }`;
    console.log(req.body);
    mkdirp(newDest, err => cb(err, newDest));
  },
  filename: function(req, file, cb) {
    cb(null, `cover${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

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
    .then(({ success, user_id }) => {
      if (success) res.status(200).send({ user_id: user_id });
      else res.sendStatus(401);
    });
});
app.post("/createAlbum", upload.single("file"), (req, res) => {
  console.log(req.body);
  store
    .createAlbum({
      title: req.body.title,
      desc: req.body.desc,
      cover: `${__dirname}/albums/${req.body.user_id}/${
        req.body.album_id
      }/cover${path.extname(req.file.originalname)}`,
      user_id: req.body.user_id
    })
    .then(({ album_id }) => {
      res.status(200).send({ album_id: album_id });
    });
});
app.get("/getAlbumId", (req, res) => {
  store.getAlbumId().then(({ album_id }) => {
    res.status(200).send({ album_id: album_id });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
