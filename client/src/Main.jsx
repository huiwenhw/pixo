import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NewUser from "./NewUser";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/newuser" component={NewUser} />
      <Route path="/:userId/albums" component={Home} />
    </Switch>
  );
};

export default Main;
