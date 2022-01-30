/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
      table.increments("id", {
          primaryKey: true
      });
      table.string("email", 80).notNullable().unique();
      table.string("username", 50).notNullable();
      table.string("password").notNullable();
      table.boolean("deleted").notNullable().defaultTo(false);
      table.timestamps(true, true);
  })
  .createTable("categories", (table) => {
    table.increments("id", { primaryKey: true });
    table.string("name", 80).notNullable();
    table.string("description", 350).nullable();
    table.boolean("deleted").notNullable().defaultTo(false);
    table.timestamps(true, true);
  })
  .createTable("products", (table) => {
    table.increments("id", { primaryKey: true });
    table.string("name", 80).notNullable();
    table.string("description", 350).nullable();
    table.boolean("deleted").notNullable().defaultTo(false);
    table.timestamps(true, true);
  })
  .createTable("product_details", (table) => {
    table.increments("id", { primaryKey: true });
    table.integer("product_id").references("id").inTable("products").notNullable();
    table.integer("category_id").references("id").inTable("categories");
    table.string("description", 350).nullable();
    table.decimal("price").notNullable();
    table.decimal("regular_price").nullable();
    table.decimal("tax_rate").nullable();
    table.integer("stock").notNullable();
    table.json("attributes").notNullable();
    table.boolean("deleted").notNullable().defaultTo(false);
    table.timestamps(true, true);
  })
  .createTable("shopping_cart", (table) => {
    table.increments("id", { primaryKey: true });
    table.integer("product_detail_id").references("id").inTable("product_details").notNullable();
    table.integer("user_id").references("id").inTable("users").notNullable();
    table.integer("quantity").notNullable();
    table.decimal("total").notNullable();
    table.decimal("tax_rate").nullable();
    table.decimal('total_price').notNullable();
    table.boolean("deleted").notNullable().defaultTo(false);
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("shopping_cart")
    .dropTableIfExists("users")
    .dropTableIfExists("product_details")
    .dropTableIfExists("categories")
    .dropTableIfExists("products");
};