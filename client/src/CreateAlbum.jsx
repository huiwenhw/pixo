import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Button from "./Button";

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
    data.append("albumId", this.props.match.params.albumid);
    data.append("userId", this.props.match.params.userid);
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
      return <Redirect to={`/${this.props.match.params.userid}/albums`} />;
    }
    return (
      <div>
        <Button
          link={`/${this.props.match.params.userid}/albums`}
          btnType="nav"
          name="Home"
        />
        <div className="form-wrapper">
          <form className="form" onSubmit={this.handleCreateAlbumSubmit}>
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
            <input className="btn submit" type="submit" value="Add Album" />
          </form>
        </div>
      </div>
    );
  }
}

export default CreateAlbum;
