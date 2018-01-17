import React from "react";
import { Switch, Route } from "react-router-dom";
import CreateAlbum from "./CreateAlbum";
import Login from "./Login";
import Home from "./Home";
import NewUser from "./NewUser";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/newuser" component={NewUser} />
      <Route path="/:userid/albums" component={Home} />
      <Route path="/:userid/createalbum" component={CreateAlbum} />
    </Switch>
  );
};

export default Main;
