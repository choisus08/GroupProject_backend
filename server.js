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
        // send newly created travel as JSON
        res.json(travel)
    }
    catch(error){
        res.status(400).json({ error })
    }
});

// SHOW - GET - /travel/:id - get a single travel location
app.get("/travel/:id", async (req, res) => {
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
app.put("/travel/:id", async (req, res) => {
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
app.delete("/travel/:id", async (req, res) => {
    try {
        const travel = await Travel.findByIdAndDelete(req.params.id)
        res.status(204).json(travel)
    } catch(error){
        res.status(400).json({error})
    }
})

// test route
app.get('/', (req, res) => {
    res.json({hello: 'world'})
});


// LISTENER
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));