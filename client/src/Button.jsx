import React from "react";
import { Link } from "react-router-dom";

const Button = ({ link, btnType, name }) => {
  return (
    <Link to={link}>
      <button className={`btn ${btnType}`}>{name}</button>
    </Link>
  );
};

export default Button;
