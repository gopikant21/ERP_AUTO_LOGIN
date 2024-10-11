require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'chrome-extension://djmdphanodpfjlndicamojohnjdnajhb'
}));


const mongoUri = process.env.MONGODB_URI; // MongoDB connection string from .env file
let db;
const saltRounds = 10; // Salt rounds for bcrypt hashing

// Connect to MongoDB
MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('IIT_KGP_ERP_LOGIN'); // Replace with your database name
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));



// POST: Save ERP credentials
app.post('/save-credentials', async (req, res) => {
  const { email, email_password, erp_username, erp_password, food, song, school } = req.body;

  try {
    // Insert ERP credentials into the 'erp_credentials' collection
    const result = await db.collection('erp_credentials').insertOne({ email, email_password, erp_username, erp_password, food, song, school });

    if (result.acknowledged === true && result.insertedId) {
      res.status(200).send('Credentials saved successfully');
    } else {
      res.status(500).send('Failed to save credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
