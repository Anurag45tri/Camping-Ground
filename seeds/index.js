const mongoose = require('mongoose');   //path module is built-in nodejs module to work with directory and pathsconst mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' , {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected successfully")
}) 

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i =0; i<50; i++){
        const random1000=Math.floor(Math.random() * 1000);
        const price =  Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '667c5661ecd9e50e05f85fef',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:  'https://unsplash.com/s/photos/cities',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore blanditiis soluta dolorum adipisci nulla? Quibusdam fugiat eum hic possimus! Nostrum? ',
            price
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})

