import React, { Component } from "react";
import axios from "axios";
import { CloudinaryContext, Image } from "cloudinary-react";
import Button from "./Button";

class Photos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      render: true,
      width: "300"
    };

    this.handleUploadWidget = this.handleUploadWidget.bind(this);
  }

  componentDidMount() {
    let id = this.props.match.params.albumid;
    axios.get(`/${id}/getPhotos`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ photos: response.data.photos });
      } else {
        this.setState({
          error: "Unable to show album photos, please try again later."
        });
      }
    });
  }

  handleUploadWidget(event) {
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
        let newFiles = [];
        for (let i in result) {
          newFiles.push({
            path: result[i].public_id,
            name: result[i].original_filename
          });
        }
        axios
          .post("/uploadPhotos", {
            albumId: this.props.match.params.albumid,
            files: newFiles
          })
          .then(response => {
            if (response.status === 200) {
              this.setState({ render: !this.state.render });
            }
            console.log(response);
          });
      }
    );
    event.preventDefault();
  }

  render() {
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
        <Button
          link={`/${this.props.match.params.userid}/albums`}
          btnType="nav"
          name="Home"
        />
        <button className="btn submit" onClick={this.handleUploadWidget}>
          Add Photos
        </button>
        <CloudinaryContext className="grid" cloudName="pixo">
          {photos}
        </CloudinaryContext>
      </div>
    );
  }
}

export default Photos;
