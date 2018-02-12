import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CloudinaryContext, Image } from "cloudinary-react";
import Button from "./Button";
import Title from "./Title";

class Albums extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      width: 300
    };
  }

  componentDidMount() {
    let userId = this.props.match.params.userId;
    axios.get(`/${userId}/albums`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ albums: response.data.albums });
      }
    });
  }

  render() {
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
        <Link to={`/${this.props.match.params.userId}/albums/create`}>
          <Button text="Add Album" />
        </Link>
        <Title text="ALBUMS" />
        <CloudinaryContext className="grid" cloudName="pixo">
          {albums}
        </CloudinaryContext>
      </div>
    );
  }
}

export default Albums;
