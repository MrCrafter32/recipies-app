const express = require('express');
const recipeRoute = require('./routes/recipe.routes.js')


const app = express();
const port = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json('Hello World!');
});

app.use('/api/recipe', recipeRoute);


app.listen(port, () => {
    console.log(`Server is on port ${port}`);
});

