const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const store = require("./store");
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

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
    .then(({ success }) => {
      if (success) res.sendStatus(200);
      else res.sendStatus(401);
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
