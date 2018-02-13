import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Navbar = ({
  home = false,
  addAlbum = false,
  userId = null,
  albumId = null,
  photos = null,
  handlerFn = () => {},
  logoutFn = () => {}
}) => {
  return (
    <div>
      {home === true && (
        <Link to={`/${userId}/albums`}>
          <Button text="Home" />
        </Link>
      )}
      {addAlbum === true && (
        <Link to={`/${userId}/albums/create/${albumId}`}>
          <Button text="Add Album" />
        </Link>
      )}
      {photos === true && <Button handler={handlerFn} text="Add Photos" />}
      <Button handler={logoutFn} text="Logout" />
    </div>
  );
};

export default Navbar;
