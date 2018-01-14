import React from "react";

const HomeView = ({ albums, handleCreateAlbumClick, handleShowAlbumClick }) => {
  let albumGrid = albums.map((album, i) => {
    return (
      <div key={i} onClick={() => handleShowAlbumClick(album.id)}>
        <img src={album.cover} alt="album cover" />
        <p> Title: {album.title} </p>
        <p> Album: {album.description} </p>
      </div>
    );
  });
  return (
    <div id="home">
      <input
        className="add-button"
        type="button"
        value="+ Add album"
        onClick={handleCreateAlbumClick}
      />
      <div className="photos-grid">{albumGrid}</div>
    </div>
  );
};

export default HomeView;
