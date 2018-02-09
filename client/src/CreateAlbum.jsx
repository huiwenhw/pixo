import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { CloudinaryContext, Image } from "cloudinary-react";
import Button from "./Button";
import Error from "./Error";

class CreateAlbum extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albumsView: false,
      error: "",
      width: 300
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
        folder: `${this.props.match.params.userId}/${
          this.props.match.params.albumid
        }`
      },
      (error, result) => {
        console.log(result);
        if (result) {
          this.setState({
            cover: result[0].public_id,
            filename: result[0].original_filename
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
      userId: this.props.match.params.userId,
      title: this.state.title,
      desc: this.state.desc,
      filepath: this.state.cover,
      filename: this.state.filename
    };

    if (!this.state.title) {
      this.setState({ error: "Please fill in your album's title!" });
    } else if (!this.state.cover) {
      this.setState({ error: "Please choose a cover photo for your album!" });
    } else {
      axios.post("/albums", data).then(response => {
        if (response.status === 200) {
          this.setState({ albumsView: true });
        }
        console.log(response);
      });
    }
    event.preventDefault();
  }

  render() {
    if (this.state.albumsView) {
      return <Redirect to={`/${this.props.match.params.userId}/albums`} />;
    }
    return (
      <div>
        <Button
          link={`/${this.props.match.params.userId}/albums`}
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
            <button
              className="btn upload-button"
              onClick={this.handleAlbumCoverUpload}
            >
              Add Image
            </button>
            {this.state.cover && (
              <CloudinaryContext className="grid" cloudName="pixo">
                <Image publicId={this.state.cover} width={this.state.width} />
              </CloudinaryContext>
            )}
            <button className="btn submit" type="submit">
              Add Album
            </button>
            <Error msg={this.state.error} />
          </form>
        </div>
      </div>
    );
  }
}

export default CreateAlbum;
