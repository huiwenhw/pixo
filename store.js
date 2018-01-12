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
        return { success: hash === user.encrypted_password, user_id: user.id };
      });
  },
  createAlbum({ title, desc, cover, user_id }) {
    console.log(`creating album ${title}, ${desc}, ${cover}, ${user_id}`);
    return knex("albums")
      .insert({
        title,
        description: desc,
        cover,
        user_id
      })
      .returning("id")
      .then(([id]) => {
        console.log(`album ${id}`);
        return { album_id: id };
      });
  },
  getAlbumId() {
    return knex("albums")
      .orderBy("id", "desc")
      .limit(1)
      .then(([album]) => {
        console.log(album);
        return { album_id: album.id };
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
