import React, { Component } from "react";
import axios from "axios";
import CreateUserView from "./CreateUserView";
import LoginView from "./LoginView";
import HomeView from "./HomeView";
import UploadView from "./UploadView";
import PhotoView from "./PhotoView";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      currAlbumId: null,
      desc: "",
      error: "",
      image: null,
      nextAlbumId: null,
      password: "",
      photos: [],
      title: "",
      userId: null,
      username: "",
      view: "login",
      toUploadPhotos: []
    };

    this.handleAlbumFieldsChange = this.handleAlbumFieldsChange.bind(this);
    this.handleCreateAlbumClick = this.handleCreateAlbumClick.bind(this);
    this.handleCreateAlbumSubmit = this.handleCreateAlbumSubmit.bind(this);
    this.handleCreateUserButton = this.handleCreateUserButton.bind(this);
    this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
    this.handleDropPhotos = this.handleDropPhotos.bind(this);
    this.handleUploadPhotos = this.handleUploadPhotos.bind(this);
    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleAlbumCoverUpload = this.handleAlbumCoverUpload.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleAlbumClick = this.handleAlbumClick.bind(this);
  }

  getUserAlbums(id) {
    axios.get(`/albums/${id}`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({ albums: response.data.albums });
      }
    });
  }

  handleAlbumFieldsChange(event) {
    event.preventDefault();
    let name = event.target.name;
    this.setState({ [name]: event.target.value });
  }

  handleCreateAlbumClick(event) {
    event.preventDefault();
    this.setState({ view: "createalbum" });
  }

  handleCreateAlbumSubmit(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("albumId", this.state.nextAlbumId);
    data.append("userId", this.state.userId);
    data.append("title", this.state.title);
    data.append("desc", this.state.desc);
    data.append("file", this.state.image);
    console.log(data);

    axios.post("/albums", data).then(response => {
      if (response.status === 200) {
        this.getUserAlbums(this.state.userId);
        this.setState({
          nextAlbumId: response.data.albumId + 1,
          view: "home"
        });
      }
      console.log(response);
    });
  }

  handleCreateUserButton() {
    this.setState({ view: "createuser" });
  }

  handleCreateUserSubmit(event) {
    event.preventDefault();
    axios
      .post("/user", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({ view: "login" });
        }
        console.log(response);
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
    console.log(photosDict);

    const data = new FormData();
    data.append("albumId", this.state.currAlbumId);
    data.append("userId", this.state.userId);
    for (let i in this.state.toUploadPhotos) {
      if (!photosDict[this.state.toUploadPhotos[i].name]) {
        data.append("files", this.state.toUploadPhotos[i]);
      }
    }
    console.log(data);

    event.preventDefault();
    axios.post("/uploadPhotos", data).then(response => {
      if (response.status === 200) {
        this.setState({ toUploadPhotos: [] });
      }
      console.log(response);
    });
    event.preventDefault();
  }

  handleFieldsChange(event) {
    event.preventDefault();
    let name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  handleAlbumCoverUpload(event) {
    event.preventDefault();
    let file = event.target.files[0];
    let name = file.name.toLowerCase();
    if (name.match(/\.(jpg|jpeg|png|gif)$/)) {
      console.log(file);
      this.setState({ image: file });
    } else {
      this.setState({ error: "Only image files are allowed!" });
    }
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          this.getUserAlbums(response.data.userId);
          this.setState({
            currUser: this.state.username,
            userId: response.data.userId,
            view: "home"
          });
        }
        console.log(response);
      });
    axios.get("/getAlbumId").then(response => {
      if (response.status === 200) {
        this.setState({
          nextAlbumId: response.data.albumId
        });
      }
    });
  }

  handleAlbumClick(id) {
    console.log(`album id ${id}`);
    axios.get(`/getPhotos/${id}`).then(response => {
      console.log(response);
      if (response.status === 200) {
        this.setState({
          view: "photos",
          currAlbumId: id,
          photos: response.data.photos
        });
      } else {
        this.setState({
          error: "Unable to show album photos, please try again later."
        });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.view === "login" && (
          <LoginView
            handleLoginSubmit={this.handleLoginSubmit}
            handleFieldsChange={this.handleFieldsChange}
            handleCreateUserButton={this.handleCreateUserButton}
          />
        )}
        {this.state.view !== "login" &&
          (this.state.view !== "createuser" && (
            <p className="greeting"> Hello {this.state.currUser}! </p>
          ))}
        {this.state.view === "createuser" && (
          <CreateUserView
            handleFieldsChange={this.handleFieldsChange}
            handleCreateUserSubmit={this.handleCreateUserSubmit}
          />
        )}
        {this.state.view === "home" && (
          <HomeView
            albums={this.state.albums}
            currUser={this.state.currUser}
            handleCreateAlbumClick={this.handleCreateAlbumClick}
            handleAlbumClick={this.handleAlbumClick}
          />
        )}
        {this.state.view === "createalbum" && (
          <UploadView
            currUser={this.state.currUser}
            handleCreateAlbumSubmit={this.handleCreateAlbumSubmit}
            handleAlbumFieldsChange={this.handleAlbumFieldsChange}
            handleAlbumCoverUpload={this.handleAlbumCoverUpload}
          />
        )}
        {this.state.view === "photos" && (
          <PhotoView
            handleUploadPhotos={this.handleUploadPhotos}
            handleDropPhotos={this.handleDropPhotos}
            toUploadPhotos={this.state.toUploadPhotos}
            photos={this.state.photos}
          />
        )}
      </div>
    );
  }
}

export default Main;
