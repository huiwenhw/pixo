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
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "pixo",
        upload_preset: "zupqatkm",
        folder: `${this.props.match.params.userid}/${
          this.props.match.params.albumid
        }`
      },
      (error, result) => {
        console.log(result);
        if (result) {
          this.setState({
            cover: result[0].public_id
          });
        } else {
          console.log(error);
        }
      }
    );
    event.preventDefault();
  }

  handleAlbumFieldsChange(event) {
    let name = event.target.name;
    this.setState({ [name]: event.target.value });
    event.preventDefault();
  }

  handleCreateAlbumSubmit(event) {
    let data = {
      userId: this.props.match.params.userid,
      title: this.state.title,
      desc: this.state.desc,
      cover: this.state.cover
    };

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
            <p className="title"> CREATE ALBUM </p>
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
              type="button"
              className="upload-button"
              onClick={this.handleAlbumCoverUpload}
              value="Add Image"
            />
            <button className="btn submit" type="submit">
              Add Album
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateAlbum;
