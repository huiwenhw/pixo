import React from "react";
import { Switch, Route } from "react-router-dom";
import Albums from "./Albums";

const Home = () => (
  <Switch>
    <Route exact path="/:userid/albums" component={Albums} />
    {/* <Route exact path="/:userid/albums/:id" component={Photos} /> */}
  </Switch>
);

export default Home;
