/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const usersData = require('../seed-data/seeded-users');
const postsData = require('../seed-data/seeded-posts');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('posts').del();
  await knex('users').del();
  await knex('users').insert(usersData);
  await knex('posts').insert(postsData);
};