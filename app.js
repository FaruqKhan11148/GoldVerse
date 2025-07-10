const express = require("express");
const app = express();
require("dotenv").config();
const ejs=require("ejs");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const PORT = 3003;
const flash = require('connect-flash');
const session = require("express-session");
const rateRoute=require("./routes/rate");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const landingPageRoute=require("./routes/landingPage");
const MongoStore = require('connect-mongo');
app.use(express.urlencoded({ extended: true }));
const User = require('./model/user.js');
const userRouter = require('./routes/user');
const mainRoute= require("./routes/mainRoute.js");
app.use(express.static(path.join(__dirname, 'public')));
const connectDB = require("./db");
connectDB(); // 🔗 Connect to MongoDB

const dbUrl=process.env.Mongo_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on('error', () => {
  console.log('Error in Mongo Session Store');
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});


app.use("/landingPage", landingPageRoute);

app.use("/rate",rateRoute);

app.use("/", userRouter); //POST request for signup

app.use("/main",mainRoute);

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'something went wrong!' } = err;
  res.status(statusCode).render('error.ejs', { message });
});


app.listen(PORT, () => {
    console.log(`✅ Server live on http://localhost: ${PORT}`);
});
