import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };

    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleNewUserSubmit = this.handleNewUserSubmit.bind(this);
  }

  handleFieldsChange(event) {
    let name = event.target.name;
    this.setState({ [name]: event.target.value });
    event.preventDefault();
  }

  handleNewUserSubmit(event) {
    axios
      .post("/user", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response);
        this.setState({ loggedIn: true });
      });
    event.preventDefault();
  }

  render() {
    if (this.state.loggedIn === true) {
      return <Redirect to={"/"} />;
    }
    return (
      <div id="login">
        <div id="login-wrapper">
          <form onSubmit={this.handleNewUserSubmit}>
            <h1> Welcome </h1>
            <input
              type="text"
              name="username"
              placeholder="username"
              onChange={this.handleFieldsChange}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={this.handleFieldsChange}
            />
            <input type="submit" value="Sign Up" />
          </form>
        </div>
      </div>
    );
  }
}

export default NewUser;
