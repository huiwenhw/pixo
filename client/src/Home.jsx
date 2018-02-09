import React from "react";
import { Switch, Route } from "react-router-dom";
import Albums from "./Albums";
import CreateAlbum from "./CreateAlbum";
import Header from "./Header";
import Photos from "./Photos";

const Home = () => {
  return (
    <div className="container">
      <Header />
      <Switch>
        <Route exact path="/:userId/albums" component={Albums} />
        <Route exact path="/:userId/albums/:albumid" component={Photos} />
        <Route path="/:userId/albums/create/:albumid" component={CreateAlbum} />
      </Switch>
    </div>
  );
};

export default Home;
