/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema
        .dropTableIfExists('accounts')
        .createTable('accounts', (table) => {
            table.uuid('id').notNullable().primary()
            table.integer('balance').nullable()
        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable('accounts')
}
