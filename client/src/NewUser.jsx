import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Error from "./Error";
import Header from "./Header";

class NewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
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
        if (response.data.success) {
          this.setState({ loggedIn: true, userId: response.data.userId });
        } else {
          this.setState({ loggedIn: false, error: response.data.error });
        }
      });
    event.preventDefault();
  }

  render() {
    if (this.state.loggedIn === true) {
      return <Redirect to={`/${this.state.userId}/albums`} />;
    }
    return (
      <div className="center login">
        <div className="form-wrapper login">
          <form className="form" onSubmit={this.handleNewUserSubmit}>
            <Header />
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
            <button className="btn submit" type="submit">
              Sign Up
            </button>
          </form>
          <Error msg={this.state.error} />
        </div>
      </div>
    );
  }
}

export default NewUser;
