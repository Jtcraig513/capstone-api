const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile.js'));

// Get all posts route
router.get('/', (req, res) => {
  // Select post and user fields by using a join between posts and users tables and order them chronologically, newest first
  knex
    .select(
      'collections.id as collection_id',
      'collections.movie_id as movie_id',
      'collections.title',
      'collections.poster',
      'collections.updated_at',
      'users.id as user_id',
    )
    .from('collections')
    .leftJoin('users', 'collections.user_id', 'users.id')
    .where('users.id', req.user.id)
    .orderBy('collections.updated_at', 'desc')
    .then((collection) => {
      let updatedCollection = collection;

      res.status(200).json(updatedCollection);
    })
    .catch(() => {
      res.status(500).json({ message: 'Error fetching collections' });
    });
});

// Create a new collection movie route
router.post('/', (req, res) => {
    // If user is not logged in, we don't allow them to create a new post
    if (req.user === undefined)
      return res.status(401).json({ message: 'Unauthorized' });
  
    // Validate request body for required fields
    if (!req.body.movie_id || !req.body.title || !req.body.poster) {
      return res
        .status(400)
        .json({ message: 'Missing movie id, title or poster fields' });
    }
  
    // Insert new post into DB: user_id comes from session, title and content from a request body
    knex('collections')
      .insert({
        user_id: req.user.id,
        movie_id: req.movie_id,
        title: req.body.title,
        poster: req.body.poster,
      })
      .then((collectionId) => {
        // Send newly created postId as a response
        res.status(201).json({ newColletionId: collectionId[0] });
      })
      .catch(() => {
        res.status(500).json({ message: 'Error creating a new collection entry' });
      });
});


module.exports = router;