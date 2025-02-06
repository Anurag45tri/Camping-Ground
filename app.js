const express = require('express'); //Imports express modules, handles the req, res.
const path = require('path');      //path module is built-in nodejs module to work with directory and paths
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash'); 
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');





mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected successfully")
}) 

const app = express();              //creating an express app(creating an instance) app obj will define routes and other config.                                   

app.engine('ejs', ejsMate);

//its a templating engine
app.set('view engine', 'ejs');

//where the directory are located 
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUnintialized: true,

    cookie: {
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
} 

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));



passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session);
    app.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})






app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


//defining the route
app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not  Found', 404))
}) 

app.use((err, req, res, next) => {
    const {statusCode=500} =err;
    if(!err.message)  err.message='Something went wrong'
    res.status(statusCode).render('error',{err});
})

//starting the server
app.listen(3000, () => {
    console.log("Serving on port 3000")
})