import React from "react";

const UploadView = ({
  handleCreateAlbumSubmit,
  handleAlbumFieldsChange,
  handleAlbumCoverUpload
}) => {
  return (
    <div id="album">
      <div id="album-form">
        <form onSubmit={handleCreateAlbumSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Album Title"
            onChange={handleAlbumFieldsChange}
          />
          <input
            type="text"
            name="desc"
            placeholder="Album Description"
            onChange={handleAlbumFieldsChange}
          />
          <input type="file" name="image" onChange={handleAlbumCoverUpload} />
          <input className="add-album" type="submit" value="Add Album" />
        </form>
      </div>
    </div>
  );
};

export default UploadView;
