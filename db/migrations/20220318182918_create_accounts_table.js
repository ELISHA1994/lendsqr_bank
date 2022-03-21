/**
 * @param { import("knex").Knex } knex
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function up(knex) {
    return  knex.schema
        .dropTableIfExists('accounts')
        .createTable('accounts', (table) => {
            table.uuid('id').notNullable().primary()
            table.integer('balance').nullable()
        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns {Promise<Knex.SchemaBuilder>}
 */
export async function down(knex) {
    return  knex.schema.dropTable('accounts')
}
