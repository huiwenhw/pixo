import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { CloudinaryContext, Image } from "cloudinary-react";
import Navbar from "./Navbar";
import Title from "./Title";

class Albums extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albumId: 0,
      albums: [],
      loggedIn: true,
      width: 300
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/albums`)
      .then(response => {
        console.log(response);
        this.setState({
          albumId: response.data.albumId,
          albums: response.data.albums
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  handleLogout(event) {
    event.preventDefault();
    axios.get("/logout").then(response => {
      this.setState({ loggedIn: false });
    });
  }

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    let albums = this.state.albums.map((album, i) => {
      return (
        <div key={i}>
          <Link to={`/${this.props.match.params.userId}/albums/${album.id}`}>
            <Image publicId={album.cover} width={this.state.width} />
            <p className="image desc">
              {album.title} | {album.description}
            </p>
          </Link>
        </div>
      );
    });
    return (
      <div id="home">
        <Navbar
          addAlbum={true}
          userId={this.props.match.params.userId}
          albumId={this.state.albumId}
          logoutFn={this.handleLogout}
        />
        <Title text="ALBUMS" />
        <CloudinaryContext className="grid" cloudName="pixo">
          {albums}
        </CloudinaryContext>
      </div>
    );
  }
}

export default Albums;
