import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Albums extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      nextAlbumId: null
    };
  }

  componentDidMount() {
    let id = this.props.match.params.userid;
    axios.get(`/${id}/albums`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ albums: response.data.albums });
      }
    });
    axios.get("/getAlbumId").then(response => {
      if (response.status === 200) {
        this.setState({
          nextAlbumId: response.data.albumId + 1
        });
      }
    });
  }

  render() {
    let albumGrid = this.state.albums.map((album, i) => {
      return (
        <div key={i}>
          <Link to={`/${this.props.match.params.userid}/albums/${album.id}`}>
            <img src={album.cover} alt="album cover" />
            <div className="overlay" />
            <p className="album-desc">
              {album.title} <br /> {album.description}
            </p>
          </Link>
        </div>
      );
    });
    return (
      <div id="home">
        <Link
          to={`/${this.props.match.params.userid}/createalbum/${
            this.state.nextAlbumId
          }`}
        >
          <button className="add-button">+ Add album</button>
        </Link>
        <div className="photos-grid">{albumGrid}</div>
      </div>
    );
  }
}

export default Albums;