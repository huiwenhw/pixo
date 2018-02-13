import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NewUser from "./NewUser";
import PrivateRoute from "./PrivateRoute";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/newuser" component={NewUser} />
      <PrivateRoute path="/:userId/albums" component={Home} />
    </Switch>
  );
};

export default Main;
