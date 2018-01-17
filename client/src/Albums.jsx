import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class Albums extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: []
    };
  }

  componentDidMount() {
    let id = this.props.match.params.userid;
    axios.get(`/albums/${id}`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ albums: response.data.albums });
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
            <p>
              {album.title} <br /> {album.description}
            </p>
          </Link>
        </div>
      );
    });
    return (
      <div id="home">
        <Link to={`/${this.props.match.params.userid}/createalbum`}>
          <button className="add-button">+ Add album</button>
        </Link>
        <div className="photos-grid">{albumGrid}</div>
      </div>
    );
  }
}

export default Albums;
