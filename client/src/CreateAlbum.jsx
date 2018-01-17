import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class CreateAlbum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albumsView: false
    };

    this.handleAlbumCoverUpload = this.handleAlbumCoverUpload.bind(this);
    this.handleAlbumFieldsChange = this.handleAlbumFieldsChange.bind(this);
    this.handleCreateAlbumSubmit = this.handleCreateAlbumSubmit.bind(this);
  }

  handleAlbumCoverUpload(event) {
    let file = event.target.files[0];
    let name = file.name.toLowerCase();
    if (name.match(/\.(jpg|jpeg|png|gif)$/)) {
      console.log(file);
      this.setState({ image: file });
    } else {
      this.setState({ error: "Only image files are allowed!" });
    }
    event.preventDefault();
  }

  handleAlbumFieldsChange(event) {
    let name = event.target.name;
    this.setState({ [name]: event.target.value });
    event.preventDefault();
  }

  handleCreateAlbumSubmit(event) {
    const data = new FormData();
    data.append("albumId", this.state.nextAlbumId);
    data.append("userId", this.state.userId);
    data.append("title", this.state.title);
    data.append("desc", this.state.desc);
    data.append("file", this.state.image);
    console.log(data);

    axios.post("/albums", data).then(response => {
      if (response.status === 200) {
        this.setState({ albumsView: true });
      }
      console.log(response);
    });
    event.preventDefault();
  }

  render() {
    if (this.state.albumsView) {
      <Redirect to={`${this.props.match.params.userid}/albums`} />;
    }
    return (
      <div id="album">
        <div id="album-form">
          <form onSubmit={this.handleCreateAlbumSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Album Title"
              onChange={this.handleAlbumFieldsChange}
            />
            <input
              type="text"
              name="desc"
              placeholder="Album Description"
              onChange={this.handleAlbumFieldsChange}
            />
            <input
              type="file"
              name="image"
              onChange={this.handleAlbumCoverUpload}
            />
            <input className="add-album" type="submit" value="Add Album" />
          </form>
        </div>
      </div>
    );
  }
}

export default CreateAlbum;
