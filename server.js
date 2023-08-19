// DEPENDENCIES
require('dotenv').config();
const {PORT = 8000, DATABASE_URL } = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// MONGOOSE CONNECTION
mongoose.connect(DATABASE_URL);
mongoose.connection
    .on('open', () => console.log('You are now connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error))

// MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// MODEL
const travelSchema = new mongoose.Schema({
    location: String,   
    landmark: String,
    image: String,
    dates: String
});

const Travel = mongoose.model("Travel", travelSchema)
// ROUTES

// INDEX - GET - /travel - gets all travel locations
app.get("/travel", async (req, res) => {
    try {
        // fetch data and store it in variable: travel
        const travel = await Travel.find({});
        // send json
        res.json(travel)
    } catch (error) {
        // send error as json
        res.status(400).json({ error })
    }
})

// CREATE - POST - /travel - create a new travel location
app.post("/travel", async (req, res) => {
    try {
        // create the new travel location
        const travel = await Travel.create(req.body)
        // send newly created cheese as JSON
        res.json(travel)
    }
    catch(error){
        res.status(400).json({ error })
    }
});

// test route
app.get('/', (req, res) => {
    res.json({hello: 'world'})
});


// LISTENER
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));