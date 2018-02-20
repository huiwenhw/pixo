import React from "react";

const Button = ({ extraClass = "", text, type = "", handler = () => {} }) => {
  return (
    <button type={type} className={`btn ${extraClass}`} onClick={handler}>
      {text}
    </button>
  );
};

export default Button;
