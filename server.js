// DEPENDENCIES
require('dotenv').config();
const {PORT = 8000, DATABASE_URL } = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// import cookie parser
const cookieParser = require("cookie-parser");
// import bcrypt  
const bcrypt = require("bcryptjs")
// import jwt
const jwt = require("jsonwebtoken")
const Environment = process.env.NODE_ENV

// MONGOOSE CONNECTION
mongoose.connect(DATABASE_URL);
mongoose.connection
    .on('open', () => console.log('You are now connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error))
;


// MIDDLEWARE
if (Environment === "development"){
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}

if (Environment === "production"){
  app.use(
    cors({
      origin: "https://groupproject-backend.onrender.com",
      credentials: true,
    })
  );
};

app.use(morgan('dev'));
app.use(express.json());
// cookie parser for reading cookies (needed for auth)
app.use(cookieParser());

async function authCheck(req, res, next){
    // check if the request has a cookie
    if(req.cookies.token){
      // if there is a cookie, try to decode it
      const payload = await jwt.verify(req.cookies.token, process.env.SECRET)
      // store the payload in the request
      req.payload = payload;
      // move on to the next piece of middleware
      next();
    } else {
      // if there is no cookie, return an error
      res.status(400).json({ error: "You are not authorized" });
    }
}

// MODELS
// USER model for logged in users

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true},
  });
  
const User = mongoose.model("User", UserSchema);

const travelSchema = new mongoose.Schema({
    location: String,   
    landmark: String,
    image: String,
    dates: String,
    username: String
});

const Travel = mongoose.model("Travel", travelSchema)
// ROUTES

// INDEX - GET - /travel - gets all travel locations
app.get("/travel", authCheck, async (req, res) => {
    try {
        // fetch data and store it in variable: travel
        const travel = await Travel.find({username: req.payload.username});
        // send json
        res.json(travel)
    } catch (error) {
        // send error as json
        res.status(400).json({ error })
    }
})

// CREATE - POST - /travel - create a new travel location
app.post("/travel", authCheck, async (req, res) => {
    try {
      req.body.username = req.payload.username
        // create the new travel location
        const travel = await Travel.create(req.body)
        // send newly created travel as JSON
        res.json(travel)
    }
    catch(error){
        res.status(400).json({ error })
    }
});

// SHOW - GET - /travel/:id - get a single travel location
app.get("/travel/:id", authCheck, async (req, res) => {
    try {
      // get a travel location from the database
      const travel = await Travel.findById(req.params.id);
      // return the location as json
      res.json(travel);
    } catch (error) {
      res.status(400).json({ error });
    }
});

// UPDATE - PUT - /travel/:id - update a single travel location
app.put("/travel/:id", authCheck, async (req, res) => {
    try {
      // update the travel location
      const travel = await Travel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      // send the updated travel as json
      res.json(travel);
    } catch (error) {
      res.status(400).json({ error });
    }
});

// DESTROY - DELETE - /travel/:id - delete a travel location
app.delete("/travel/:id", authCheck, async (req, res) => {
    try {
        const travel = await Travel.findByIdAndDelete(req.params.id)
        res.status(204).json(travel)
    } catch(error){
        res.status(400).json({error})
    }
})

// AUTH ROUTES

// /signup - POST - receives a username and password and creates a user in the database
app.post("/signup", async (req, res) => {
    try {
      // deconstruct the username and password from the body
      let { username, password } = req.body;
      // hash the password
      password = await bcrypt.hash(password, await bcrypt.genSalt(10));
      // create a new user in the database
      const user = await User.create({ username, password });
      // send the new user as json
      res.json(user);
    } catch(error){
      res.status(400).json({error})
    }
})

// /login - POST - receives a username & password, checks against database for match, returns user object with signed JWT cookie if match found
app.post("/login", async (req, res) => {
    try {
        //deconstruct
        let { username, password} = req.body
        // search
        const user = await User.findOne({ username })
        // if no user found, error
        if (!user) {
            throw new Error("No user with that username found");
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            throw new Error("Password does not match")
        }
        const token = jwt.sign({ username: user.username }, process.env.SECRET)
        if (process.env.NODE_ENV === "development"){
          res.cookie("token", token, {
          // can only be accessed by server requests
          httpOnly: true,
          // path = where the cookie is valid
          path: "/",
          // domain = what domain the cookie is valid on
           domain: "localhost",  // comment out
          // secure = only send cookie over https
          secure: false, // true
          // sameSite = only send cookie if the request is coming from the same origin
          sameSite: "lax", // "strict" | "lax" | "none" (secure must be true)
          // maxAge = how long the cookie is valid for in milliseconds    // none
          maxAge: 3600000, // 1 hour
        })};
  
        if (process.env.NODE_ENV === "production"){
          res.cookie("token", token, {
          // can only be accessed by server requests
          httpOnly: true,
          // path = where the cookie is valid
          path: "/",
          // secure = only send cookie over https  
          secure: true,  //false
          // sameSite = only send cookie if the request is coming from the same origin
          sameSite: "none", // "strict" | "lax" | "none" (secure must be true)
          // maxAge = how long the cookie is valid for in milliseconds  //lax 
          maxAge: 3600000, // 1 hour
          })};

        res.json(user)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

// get /cookietest to test our cookie
app.get("/cookietest", (req, res) => {
    res.json(req.cookies);
  })
  
// get /logout to clear our cookie
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "You have been logged out" });
})

// test route
app.get('/', (req, res) => {
  console.log(process.env.NODE_ENV)
    res.json({hello: 'world'})
});


// LISTENER
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));