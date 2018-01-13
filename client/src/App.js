import React, { Component } from "react";
import axios from "axios";
import CreateUserView from "./CreateUserView";
import LoginView from "./LoginView";
import Dropzone from "react-dropzone";
// import DropzoneComponent from "./DropzoneComponent";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: "",
      error: "",
      image: null,
      nextAlbumId: null,
      password: "",
      photos: [],
      title: "",
      userId: null,
      username: "",
      view: "login"
    };

    this.handleAlbumFieldsChange = this.handleAlbumFieldsChange.bind(this);
    this.handleCreateAlbumClick = this.handleCreateAlbumClick.bind(this);
    this.handleCreateAlbumSubmit = this.handleCreateAlbumSubmit.bind(this);
    this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropSubmit = this.handleDropSubmit.bind(this);
    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
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
  }

  handleCreateAlbumSubmit(event) {
    const data = new FormData();
    data.append("album_id", this.state.nextAlbumId);
    data.append("user_id", this.state.userId);
    data.append("title", this.state.title);
    data.append("desc", this.state.desc);
    data.append("file", this.state.image);
    console.log(data);
    axios.post("/createAlbum", data).then(response => {
      if (response.status === 200) {
        this.setState({
          nextAlbumId: response.data.album_id + 1,
          view: "home"
        });
      }
      console.log(response);
    });
    event.preventDefault();
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
      if (files[i].name.match(/\.!(jpg|jpeg|png|gif)$/)) {
        this.setState({
          error: "Only image files are allowed!"
        });
        areImages = false;
        break;
      }
    }
    if (areImages) {
      this.setState({
        photos: files
      });
    }
  }

  handleDropSubmit(event) {
    const data = new FormData();
    data.append("album_id", this.state.nextAlbumId);
    data.append("user_id", this.state.userId);
    for (let i in this.state.photos) {
      data.append("files", this.state.photos[i]);
    }
    // data.append("file", this.state.photos);
    console.log(data);
    axios.post("/uploadPhotos", data).then(response => {
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
    if (file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      console.log(file);
      this.setState({
        image: file
      });
    } else {
      this.setState({
        error: "Only image files are allowed!"
      });
    }
  }

  handleLoginSubmit(event) {
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            currUser: this.state.username,
            userId: response.data.user_id,
            view: "home"
          });
        }
        console.log(response);
      });
    axios.get("/getAlbumId").then(response => {
      if (response.status === 200) {
        this.setState({
          nextAlbumId: response.data.album_id
        });
      }
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        {this.state.view === "login" && (
          <div>
            <LoginView
              handleLoginSubmit={this.handleLoginSubmit}
              handleFieldsChange={this.handleFieldsChange}
            />
            <CreateUserView
              handleFieldsChange={this.handleFieldsChange}
              handleCreateUserSubmit={this.handleCreateUserSubmit}
            />
          </div>
        )}
        {this.state.view === "createuser" && (
          <CreateUserView
            handleFieldsChange={this.handleFieldsChange}
            handleCreateUserSubmit={this.handleCreateUserSubmit}
          />
        )}
        {this.state.view === "home" && (
          <div>
            Hi, {this.state.currUser}
            <input
              type="button"
              value="+ Add album"
              onClick={this.handleCreateAlbumClick}
            />
          </div>
        )}
        {this.state.view === "createalbum" && (
          <div>
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
                onChange={this.handleFileUpload}
              />
              <input type="submit" value="Add Album" />
            </form>
            <form onSubmit={this.handleDropSubmit}>
              <Dropzone onDrop={this.handleDrop} multiple accept="image/*">
                <p>Drop your files or click here to upload</p>
              </Dropzone>
              <ul>
                {this.state.photos.map((image, i) => {
                  return <li key={i}> {image.name} </li>;
                })}
              </ul>
              <input type="submit" value="Submit photos" />
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default App;
