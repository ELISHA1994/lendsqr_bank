// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql2',
    connection: {
      host : "localhost",
      port : "3306",
      user : "root",
      password : "T&hE9mDM",
      database : "lendsqr_bank"
    },
    migrations: {
      directory: "migrations",
    },
    seeds: {
      directory: "seeds",
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
