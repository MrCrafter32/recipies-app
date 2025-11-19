const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function listRecipes (req, res) {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const data = await prisma.recipe.findMany({
        skip: offset,
        take: limit
    });

    res.json(data)

}

function parseOp(raw){
    if (!raw) return null;
    
    const x = decodeURIComponent(String(raw).trim());

    const match = x.match(/^(>=|<=|>|<|=)?\s*(.+)$/);
    if (!match) return null;

    const op = match[1] || '=';
    const value = match[2];

    switch (op) {
        case '>':
            return { gt: Number(value) };
        case '<':
            return { lt: Number(value) };
        case '>=':
            return { gte: Number(value) };
        case '<=':
            return { lte: Number(value) };
        case '=':
            return Number(value);
        default:
            return null;
    }
}

async function recipeSearch (req, res) {

    const { title, cuisine, calories, totalTime, rating} = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    console.log(req.query)



    // console.log(req.query)

    if(!title && !cuisine && !calories && !totalTime && !rating){
        return res.status(400).json({ error: 'Provide atleast one parameter' });
    }

    

    const filters = [];

    if (title !== "") {
        filters.push({
            title: {
                contains: title,
                mode: 'insensitive'
            }
        });
    }
    if (cuisine !== "") {
        filters.push({
            cuisine: {
                contains: cuisine,
                mode: 'insensitive'
            }
        });
    }
    const calFilter = parseOp(calories);
    if (calFilter !== null) {
        filters.push({
                calories: calFilter
        });
    }
    const timeFilter = parseOp(totalTime);
    if (timeFilter !== null) {
        filters.push({
            totalTime: timeFilter
        });
    }
    const ratingFilter = parseOp(rating);
    if (ratingFilter !== null) {
        filters.push({
            rating: ratingFilter
        });
    }

    if (filters.length === 0) {
        return res.status(400).json({ error: 'Invalid Parameters' });
    }

    const skip = (page-1)*limit || 0;

    // console.log(calories, total_time, rating)

    // console.log(calFilter, timeFilter, ratingFilter)



    const data = await prisma.recipe.findMany({
        where: {
            AND: filters
        },
        skip,
        take: Number(limit) || 10
    });
    res.json(data)

}

module.exports = {
    listRecipes,
    recipeSearch
};