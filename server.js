const express = require('express')
const app = express()
const merchantModel = require("./models/merchantModels")
const mongoose = require('mongoose')



app.use(express.json()) //allows app to understand JSON




//routes
app.get('/', (req, res)=> {
    res.send('Hello Merchant API')
})


//returns all merchants
app.get('/merchants', async(req, res)=>{
    try{
        const merchants = await merchantModel.find({}); //empty curly brackets is all products
        res.status(200).json(merchants)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//returns individual merchant
app.get('/merchants/:merchantId', async(req, res)=>{
    try{
        const merchant = await merchantModel.findOne({ merchantId: req.params.merchantId }); 
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }
        res.status(200).json(merchant)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//creates the merchants
app.post('/merchants', async(req, res)=>{
    try{
        const merchant = await merchantModel.create(req.body)
        res.status(200).json(merchant);
    } 
    catch(error){
        console.log(error.message)
    }
})


//update merchants

app.put('/merchants/:merchantId', async (req, res) => {
    try {
      const { merchantId } = req.params;
      const updatedMerchant = await merchantModel.findOneAndUpdate({ merchantId }, req.body, { new: true });
      if (!updatedMerchant) {
        return res.status(404).json({ message: 'Merchant not found' });
      }
      res.status(200).json(updatedMerchant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  app.delete('/merchants/:merchantId', async (req, res) => {
    try {
      const { merchantId } = req.params;
      const deletedMerchant = await merchantModel.findOneAndDelete({ merchantId });
      if (!deletedMerchant) {
        return res.status(404).json({ message: 'Merchant not found' });
      }
      res.status(200).json({ message: 'Merchant deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });




  





//connecting to database 
mongoose.connect('mongodb+srv://conor990:Tallaght@merchantapi.sevbnez.mongodb.net/merchantAPI?retryWrites=true&w=majority')
.then(()=> {
    console.log('connected to MongoDB')
    //server listening for incoming requests
    app.listen(3000, ()=> {
        console.log('merchant API app is running on port 3000')
    });
}).catch((error)=>{
    console.log(error)
})