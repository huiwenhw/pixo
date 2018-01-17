const crypto = require("crypto");
const knex = require("knex")(require("./knexfile"));

module.exports = {
  saltHashPassword,
  createUser({ username, password }) {
    console.log(`Add user ${username} with password ${password}`);
    const { salt, hash } = saltHashPassword({ password });
    return knex("user").insert({
      salt,
      encrypted_password: hash,
      username
    });
    // .debug();
  },
  authenticate({ username, password }) {
    console.log(`Authenticating user ${username}`);
    return knex("user")
      .where({ username })
      .then(([user]) => {
        if (!user) return { success: false };
        const { hash } = saltHashPassword({
          password,
          salt: user.salt
        });
        return { success: hash === user.encrypted_password, userId: user.id };
      });
  },
  createAlbum({ title, desc, cover, userId }) {
    console.log(`creating album ${title}, ${desc}, ${cover}, ${userId}`);
    return knex("albums")
      .insert({
        title,
        description: desc,
        cover,
        user_id: userId
      })
      .returning("id")
      .then(([id]) => {
        console.log(`album ${id}`);
        return { albumId: id };
      });
  },
  uploadPhotos(photos) {
    return knex("photos").insert(photos);
  },
  getAlbumId() {
    return knex("albums")
      .orderBy("id", "desc")
      .limit(1)
      .then(([album]) => {
        console.log("get album id");
        console.log(album);
        if (album) {
          return { albumId: album.id };
        } else {
          return { albumId: 0 };
        }
      });
  },
  getAlbums({ userId }) {
    return knex("albums")
      .where("user_id", userId)
      .select("id", "title", "description", "cover")
      .then(res => {
        console.log("get albums");
        console.log(res);
        return { albums: res };
      });
  },
  getPhotos({ albumId }) {
    console.log("get photos in store js " + albumId);
    return knex("photos")
      .where("album_id", albumId)
      .select("id", "name", "description", "path")
      .then(res => {
        console.log("get photos");
        console.log(res);
        return { photos: res };
      });
  }
};

function saltHashPassword({ password, salt = randomString() }) {
  const hash = crypto.createHmac("sha512", salt).update(password);
  return {
    salt,
    hash: hash.digest("hex")
  };
}

function randomString() {
  return crypto.randomBytes(4).toString("hex");
}
