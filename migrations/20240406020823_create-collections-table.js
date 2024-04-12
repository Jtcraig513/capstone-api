/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable("collections", (table) => {
            table.increments("id").primary();
            table.integer("user_id").unsigned().notNullable();
            table.integer("movie_id").unsigned().notNullable();
            table.string("title", 50).notNullable();
            table.string("poster").notNullable();
            table.boolean("removed").notNullable().defaultTo(false);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table
                .timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
            table
                .foreign("user_id")
                .references("id")
                .inTable("users")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("collections");
};
