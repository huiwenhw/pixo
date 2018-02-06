import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      loggedIn: null,
      userId: null
    };

    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleFieldsChange(event) {
    let name = event.target.name;
    this.setState({ [name]: event.target.value });
    event.preventDefault();
  }

  handleLoginSubmit(event) {
    axios
      .post("/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({ loggedIn: true, userId: response.data.userId });
        }
      });
    event.preventDefault();
  }

  render() {
    if (this.state.loggedIn) {
      return <Redirect to={`/${this.state.userId}/albums`} />;
    }
    return (
      <div className="center login">
        <div className="form-wrapper login">
          <form className="form" onSubmit={this.handleLoginSubmit}>
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
            <button className="btn" type="submit">
              Login
            </button>
          </form>
          <Link to={"/newuser"}>
            Don't have an account yet? <span>Sign Up</span>
          </Link>
        </div>
      </div>
    );
  }
}
export default Login;
