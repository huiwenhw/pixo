exports.up = function(knex, Promise) {
  return knex.schema.createTable("photos", function(t) {
    t.increments("id").primary();
    t.string("name").notNullable();
    t.string("description").notNullable();
    t.string("path").notNullable();
    t
      .integer("album_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("albums");
    t.timestamps(false, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("photos");
};
