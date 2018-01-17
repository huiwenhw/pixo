import React, { Component } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";

class Photos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      toUploadPhotos: []
    };

    this.handleDropPhotos = this.handleDropPhotos.bind(this);
    this.handleUploadPhotos = this.handleUploadPhotos.bind(this);
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

  handleDropPhotos(files) {
    console.log(files);
    let areImages = true;
    for (let i in files) {
      let name = files[i].name.toLowerCase();
      if (name.match(/\.!(jpg|jpeg|png|gif)$/)) {
        this.setState({
          error: "Only image files are allowed!"
        });
        areImages = false;
        break;
      }
    }
    if (areImages) {
      this.setState({ toUploadPhotos: files });
    }
  }

  handleUploadPhotos(event) {
    let photosDict = this.state.photos.reduce((map, obj) => {
      map[obj.name] = obj;
      return map;
    }, {});

    const data = new FormData();
    data.append("albumId", this.props.match.params.albumid);
    data.append("userId", this.props.match.params.userid);
    for (let i in this.state.toUploadPhotos) {
      if (!photosDict[this.state.toUploadPhotos[i].name]) {
        data.append("files", this.state.toUploadPhotos[i]);
      }
    }

    axios.post("/uploadPhotos", data).then(response => {
      if (response.status === 200) {
        this.setState({ toUploadPhotos: [] });
      }
      console.log(response);
    });
    event.preventDefault();
  }

  render() {
    let photoGrid = this.state.photos.map((photo, i) => {
      return (
        <div key={i}>
          <img src={photo.path} alt={photo.name} />
        </div>
      );
    });
    return (
      <div>
        <Link to={`/${this.props.match.params.userid}/albums`}>
          <button id="home-button">Home</button>
        </Link>
        <div className="photos-grid">
          <form onSubmit={this.handleUploadPhotos}>
            <Dropzone
              id="dropzone"
              onDrop={this.handleDropPhotos}
              multiple
              accept="image/*"
            >
              <p>Drop your files or click here to add photos!</p>
              <ul>
                {this.state.toUploadPhotos.map((image, i) => {
                  return <li key={i}> {image.name} </li>;
                })}
              </ul>
            </Dropzone>
            <input className="add-button" type="submit" value="Add photos" />
          </form>
          {photoGrid}
        </div>
      </div>
    );
  }
}

export default Photos;
