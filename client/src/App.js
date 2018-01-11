import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleCreateUserSubmit(event) {
    axios
      .post("/createUser", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response);
      });
    event.preventDefault();
  }

  handleLoginChange(event) {
    let name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  handleLoginSubmit(event) {
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleLoginSubmit}>
          <h1> Login </h1>
          <input
            type="text"
            name="username"
            placeholder="username"
            onChange={this.handleLoginChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={this.handleLoginChange}
          />
          <input type="submit" value="Login" />
        </form>
        <form onSubmit={this.handleCreateUserSubmit}>
          <h1> Create new user </h1>
          <input
            type="text"
            name="username"
            placeholder="username"
            onChange={this.handleLoginChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={this.handleLoginChange}
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  }
}

export default App;
