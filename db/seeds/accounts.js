import generateUniqueId from "generate-unique-id";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed (knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()
  await knex('accounts').insert([
    {
      id: generateUniqueId({length: 10, useLetters: false}),
      balance: 1000,
    },
    {
      id: generateUniqueId({length: 10, useLetters: false}),
      balance: 250,
    },
    {
      id: generateUniqueId({length: 10, useLetters: false}),
      balance: 0,
    }
  ]);
};
