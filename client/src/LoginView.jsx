import React from "react";

const LoginView = ({ handleLoginSubmit, handleFieldsChange }) => {
  return (
    <form onSubmit={handleLoginSubmit}>
      <h1> Login </h1>
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
  );
};

export default LoginView;
