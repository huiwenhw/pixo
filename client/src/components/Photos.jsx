import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { CloudinaryContext, Image } from "cloudinary-react";
import Navbar from "./Navbar";
import Title from "./Title";

class Photos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albumTitle: "",
      albumDesc: "",
      photos: [],
      render: true,
      width: "300"
    };

    this.getPhotos = this.getPhotos.bind(this);
    this.handleUploadWidget = this.handleUploadWidget.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.getPhotos();
  }

  getPhotos() {
    let id = this.props.match.params.albumid;
    axios.get(`/album/${id}`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({
          albumTitle: response.data.album.title,
          albumDesc: response.data.album.description,
          photos: response.data.photos
        });
      }
    });
  }

  handleUploadWidget(event) {
    event.preventDefault();
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
        let newFiles = [];
        for (let i in result) {
          newFiles.push({
            path: result[i].public_id,
            name: result[i].original_filename
          });
        }
        axios
          .post("/photos", {
            albumId: this.props.match.params.albumid,
            files: newFiles
          })
          .then(response => {
            console.log(response);
            this.getPhotos();
          });
      }
    );
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
    let photos = this.state.photos.map((photo, i) => {
      return (
        <div key={i}>
          <Image publicId={photo.path} width={this.state.width} />
          <p className="image desc"> {photo.name} </p>
        </div>
      );
    });
    return (
      <div>
        <Navbar
          home={true}
          photos={true}
          handlerFn={this.handleUploadWidget}
          userId={this.props.match.params.userId}
          logoutFn={this.handleLogout}
        />
        <Title text={this.state.albumTitle} />
        <Title text={this.state.albumDesc} />
        <CloudinaryContext className="grid" cloudName="pixo">
          {photos}
        </CloudinaryContext>
      </div>
    );
  }
}

export default Photos;
