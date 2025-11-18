const fs = require('fs');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


async function main() {
    const data = fs.readFileSync('data.json', 'utf-8');
    const jsonData = JSON.parse(data);


    for (let i in jsonData) {
        console.log(i)
        let { cuisine, title, rating, total_time, prep_time, cook_time, description, nutrients, serves} = jsonData[i];
        if (!cuisine||!title||!description||!nutrients||!serves){
           continue;
       }
        if (isNaN(rating)) {
            rating = "NULL"
        }
        if (isNaN(total_time)) {
            total_time = "NULL"
        }
        if (isNaN(prep_time)) {
            prep_time = "NULL"
        }
        if (isNaN(cook_time)) {
            cook_time = "NULL"
        }
        await prisma.recipe.create({
            data: {
                cuisine: cuisine,
                title: title,
                rating: rating,
                totalTime: total_time,
                prepTime: prep_time,
                cookTime: cook_time,
                description: description,
                nutrients: nutrients,
                serves: serves
            }
        })
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});