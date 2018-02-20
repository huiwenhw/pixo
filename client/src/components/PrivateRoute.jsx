import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import axios from "axios";

class PrivateRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: null
    };
  }

  componentDidMount() {
    axios.get("/user").then(response => {
      console.log(`logged in: ${response.data.loggedIn}`);
      if (response.data.loggedIn === true) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.loggedIn === true && (
          <Route path={this.props.path} component={this.props.component} />
        )}
        {this.state.loggedIn === false && <Redirect to="/" />}
      </div>
    );
  }
}

export default PrivateRoute;
