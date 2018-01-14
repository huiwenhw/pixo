import React from "react";

const CreateUserView = ({ handleFieldsChange, handleCreateUserSubmit }) => {
  return (
    <div id="login">
      <div id="login-wrapper">
        <form onSubmit={handleCreateUserSubmit}>
          <h1> Welcome </h1>
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
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    </div>
  );
};

export default CreateUserView;
