exports.up = function(knex, Promise) {
  return knex.schema.createTable("albums", function(t) {
    t.increments("id").primary();
    t.string("title").notNullable();
    t.string("description").notNullable();
    t.string("cover").notNullable();
    t
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("user");
    t.timestamps(false, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("albums");
};
