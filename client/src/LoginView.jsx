import React from "react";

const LoginView = ({
  handleLoginSubmit,
  handleFieldsChange,
  handleCreateUserButton
}) => {
  return (
    <div id="login">
      <div id="login-wrapper">
        <form onSubmit={handleLoginSubmit}>
          <h1> Hello </h1>
          <input
            type="text"
            name="username"
            placeholder="username"
            onChange={handleFieldsChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleFieldsChange}
          />
          <input type="submit" value="Login" />
        </form>
        <button onClick={handleCreateUserButton}>
          Don't have an account yet? <span>Sign Up</span>
        </button>
      </div>
    </div>
  );
};

export default LoginView;
