import React from "react";
import Dropzone from "react-dropzone";

const PhotoView = ({
  handleUploadPhotos,
  handleDropPhotos,
  toUploadPhotos,
  photos
}) => {
  let photoGrid = photos.map((photo, i) => {
    return (
      <div key={i}>
        <img src={photo.path} alt="for album" />
      </div>
    );
  });

  return (
    <div>
      <form onSubmit={handleUploadPhotos}>
        <Dropzone onDrop={handleDropPhotos} multiple accept="image/*">
          <p>Drop your files or click here to upload</p>
        </Dropzone>
        <ul>
          {toUploadPhotos.map((image, i) => {
            return <li key={i}> {image.name} </li>;
          })}
        </ul>
        <input className="add-button" type="submit" value="Add photos" />
      </form>
      <div className="photos-grid">{photoGrid}</div>
    </div>
  );
};

export default PhotoView;
