import React from "react";

const CreateUserView = ({ handleFieldsChange, handleCreateUserSubmit }) => {
  return (
    <form onSubmit={handleCreateUserSubmit}>
      <h1> Create new user </h1>
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

export default CreateUserView;
