import React from "react";

const HomeView = ({ albums, handleCreateAlbumClick, handleAlbumClick }) => {
  let albumGrid = albums.map((album, i) => {
    return (
      <div key={i} onClick={() => handleAlbumClick(album.id)}>
        <img src={album.cover} alt="album cover" />
        <div className="overlay" />
        <p>
          {album.title} <br /> {album.description}
        </p>
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
