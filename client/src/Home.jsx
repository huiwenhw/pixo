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
        <Route exact path="/:userId/albums/create" component={CreateAlbum} />
        <Route exact path="/:userId/albums/:albumid" component={Photos} />
        <Route exact path="/:userId/albums" component={Albums} />
      </Switch>
    </div>
  );
};

export default Home;
