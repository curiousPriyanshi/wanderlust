if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();

}

const express = require("express");
const MongoStore = require('connect-mongo').default;
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError");
const session = require("express-session");
const flash = require("connect-flash")
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js")
const reviewsRouter = require('./routes/review.js')
const userRouter = require("./routes/user.js");

app.use(methodOverride('_method')); // for PUT and DELETE requests

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

async function main() {
    await mongoose.connect(dbUrl)
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate); // Use ejsMate as the template engine
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60 // time period in seconds.. time till which session is not updated in db if no changes are made to session
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});
let sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 
        httpOnly: true //to prevent cross site scripting attacks
    }
}



// app.get("/", (req, res) => {
//     res.send("Hi! I am root");
// })

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; //passport adds user property to req object
    next();
})
passport.use(new localStrategy(User.authenticate())); //authenticate method is added by passport-local-mongoose plugin to User model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// //logger:- morgan is a popular logging middleware for Express.js applications

//to create statndard route if url does not matches any of above specified routes
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page Not Found"));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;   //variable in express error class and the variable used here should be same
    res.status(status).render('error.ejs', { message })
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
