const express = require('express')
const app = express()
const https = require('https');
const fs = require('fs');
const Meal = require('./models/mealsModels.js');
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');



// Loading in the certificate and private key
const key = process.env.KEY_PEM;
const cert = process.env.CERT_PEM;
const ca = fs.readFileSync('cert.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};


// Creating the HTTPS server with the credentials
const httpsServer = https.createServer(credentials, app);

// ***API is running over HTTPS, which helps to address the sensitive data exposure issue.
//*** Added validation and sanitization rules for the inputs(put and post) /fixing injection a1 and cross site scripting vulnerabilities because it was displaying user generated content without validation*/
//removed sensitive data from being returned to user addressing Sensitive Data Exposure (A3) problem.

app.use(express.json()) //allows app to understand JSON




//routes
app.get('/', (req, res)=> {
    res.send('Hello Meals API')
})


app.get('/meals', async (req, res) => {
  try {
    const meals = await Meal.find({});
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//returns individual meal
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


//update merchants   / Broken Access Control (A5)
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
.then(()=> {
    console.log('connected to MongoDB')
    //server listening for incoming requests
    httpsServer.listen(3000, () => {
      console.log('merchant API app is running on port 3000');
    }).on('error', (error) => {
      console.error('Error starting HTTPS server:', error);
    });
}).catch((error)=>{
    console.log(error)
})