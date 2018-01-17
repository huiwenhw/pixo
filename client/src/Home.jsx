import React from "react";
import { Switch, Route } from "react-router-dom";
import Albums from "./Albums";
import Photos from "./Photos";
import Header from "./Header";

const Home = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/:userid/albums" component={Albums} />
        <Route exact path="/:userid/albums/:albumid" component={Photos} />
      </Switch>
    </div>
  );
};

export default Home;
