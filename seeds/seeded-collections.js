/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
// A library for generating mock data
const casual = require('casual');

exports.seed = function (knex) {
  // First, delete all posts from the table
  return knex('collections')
    .del()
    .then(() => {
      // Get all user ids from users table
      return knex('users').select('id');
    })
    .then((userIds) => {
      const mockCollections = [];

      // Generate 10 posts
      for (let i = 0; i < 10; i++) {
        // Select a user id randomly from the list of users to create a post for
        const randomIndex = Math.floor(Math.random() * userIds.length);
        const randomId = userIds[randomIndex].id;

        // Use user id from users table for user_id and `casual` library to generate mock title and content fields
        mockCollections.push({
          user_id: randomId,
          movie_id: Math.floor(Math.random() * 300),
          title: 'Title Placeholder',
          poster: 'https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        });
      }

      // Insert mock posts into the table
      return knex('collections').insert(mockCollections);
    });
};