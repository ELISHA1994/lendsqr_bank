// import generateUniqueId from "generate-unique-id";

export async function seed (knex) {
  // Deletes ALL existing entries
  return  knex('accounts').del()
      .then(function () {
        return knex('accounts').insert([
          {
            id: '2072723561',
            balance: 1000,
          },
          {
            id: '2644215508',
            balance: 250,
          },
          {
            id: '2037891297',
            balance: 0,
          }
        ]);
      })
}
