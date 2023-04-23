const express = require('express');
const app = express();
const http = require('http');
const Meal = require('./models/mealsModels.js');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

app.use(express.json()); //allows app to understand JSON

//routes
app.get('/', (req, res) => {
  res.send('Hello Meals API');
});

app.get('/meals', async (req, res) => {
  try {
    const meals = await Meal.find({});
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/meals/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/meals', async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/meals/bulk', async (req, res) => {
  try {
    const meals = req.body.meals;
    const insertedMeals = await Meal.insertMany(meals);
    res.status(201).json(insertedMeals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/meals/:id', [
  body('name').trim().escape().isLength({ min: 1 }).withMessage("Please enter the meal's name"),
  body('prep_time').isNumeric().withMessage("Please enter the meal's prep time"),
  body('calories').isNumeric().withMessage("Please enter the meal's calories"),
  body('origin').trim().escape().isLength({ min: 1 }).withMessage("Please enter the meals origin"),
  body('continent').trim().escape().isLength({ min: 1 }).withMessage("Please enter the meals continent of origin")
], async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/meals/:id', async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//connecting to database 
mongoose.connect('mongodb+srv://conor990:Tallaght1!@mealsapi.pnm5tav.mongodb.net/test')
  .then(() => {
    console.log('connected to MongoDB');

    //server listening for incoming requests
    const server = http.createServer(app);
    server.listen
  }
  )