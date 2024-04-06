// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// Import dotenv to process environment variables from `.env` file.
require("dotenv").config();

module.exports = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    database: process.env.DB_LOCAL_DBNAME,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
    charset: "utf8",
  },
};