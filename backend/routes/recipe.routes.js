const express = require('express')
const router = express.Router();
const recipeController = require('../controllers/recipes.controller.js')



router.get('/', recipeController.listRecipes);
router.get('/search', recipeController.recipeSearch);


module.exports = router;