import React, { Component } from "react";
import axios from "axios";
import CreateUserView from "./CreateUserView";
import LoginView from "./LoginView";
import HomeView from "./HomeView";
import UploadView from "./UploadView";
import PhotoView from "./PhotoView";

class App extends Component {
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
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropSubmit = this.handleDropSubmit.bind(this);
    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleShowAlbumClick = this.handleShowAlbumClick.bind(this);
  }

  getUserAlbums(id) {
    axios
      .post("/albums", {
        userId: id
      })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({
            albums: response.data.albums
          });
        }
      });
  }

  handleAlbumFieldsChange(event) {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  handleCreateAlbumClick(event) {
    this.setState({
      view: "createalbum"
    });
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

    axios.post("/createAlbum", data).then(response => {
      if (response.status === 200) {
        this.getUserAlbums(this.state.userId);
        this.setState({
          nextAlbumId: response.data.albumId + 1,
          view: "home"
        });
      }
      console.log(response);
    });
    event.preventDefault();
  }

  handleCreateUserButton() {
    this.setState({
      view: "createuser"
    });
  }

  handleCreateUserSubmit(event) {
    axios
      .post("/createUser", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            view: "login"
          });
        }
        console.log(response);
      });
    event.preventDefault();
  }

  handleDrop(files) {
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
      this.setState({
        toUploadPhotos: files
      });
    }
  }

  handleDropSubmit(event) {
    const data = new FormData();
    data.append("albumId", this.state.nextAlbumId - 1);
    data.append("userId", this.state.userId);
    for (let i in this.state.toUploadPhotos) {
      data.append("files", this.state.toUploadPhotos[i]);
    }
    console.log(data);
    axios.post("/uploadPhotos", data).then(response => {
      if (response.status === 200) {
        this.handleShowAlbumClick(this.state.currUser);
        this.setState({
          toUploadPhotos: []
        });
      }
      console.log(response);
    });
    event.preventDefault();
  }

  handleFieldsChange(event) {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  handleFileUpload(event) {
    let file = event.target.files[0];
    let name = file.name.toLowerCase();
    if (name.match(/\.(jpg|jpeg|png|gif)$/)) {
      console.log(file);
      this.setState({
        image: file
      });
    } else {
      this.setState({
        error: "Only image files are allowed!"
      });
    }
    event.preventDefault();
  }

  handleLoginSubmit(event) {
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
    event.preventDefault();
  }

  handleShowAlbumClick(id) {
    console.log(`id ${id}`);
    axios
      .post("/getAlbumPhotos", {
        albumId: id
      })
      .then(response => {
        console.log(response);
        this.setState({
          view: "photos",
          currAlbumId: id,
          photos: response.data.photos
        });
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
        {this.state.view !== "login" && (
          <p className="greeting"> Hello {this.state.currUser}! </p>
        )}
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
            handleShowAlbumClick={this.handleShowAlbumClick}
          />
        )}
        {this.state.view === "createalbum" && (
          <UploadView
            currUser={this.state.currUser}
            handleCreateAlbumSubmit={this.handleCreateAlbumSubmit}
            handleAlbumFieldsChange={this.handleAlbumFieldsChange}
            handleFileUpload={this.handleFileUpload}
          />
        )}
        {this.state.view === "photos" && (
          <PhotoView
            handleDropSubmit={this.handleDropSubmit}
            handleDrop={this.handleDrop}
            toUploadPhotos={this.state.toUploadPhotos}
            photos={this.state.photos}
          />
        )}
      </div>
    );
  }
}

export default App;
