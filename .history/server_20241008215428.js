require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
app.use(bodyParser.json());

const mongoUri = process.env.MONGODB_URI; // MongoDB connection string from .env file
let db;
const saltRounds = 10; // Salt rounds for bcrypt hashing

// Connect to MongoDB
MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('IIT KGP ERP LOGIN'); // Replace with your database name
  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// POST: Authenticate or Create User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists in the 'users' collection
    const user = await db.collection('users').findOne({ email });

    if (user) {
      // User exists, check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Incorrect password');
      }
    } else {
      // User does not exist, create a new user with hashed password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = { email, password: hashedPassword };
      const result = await db.collection('users').insertOne(newUser);

      if (result.insertedCount > 0) {
        res.status(201).send('User created and logged in successfully');
      } else {
        res.status(500).send('Failed to create user');
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST: Save ERP credentials
app.post('/save-credentials', async (req, res) => {
  const { username, password, favorite food,  } = req.body;

  try {
    // Insert ERP credentials into the 'erp_credentials' collection
    const result = await db.collection('erp_credentials').insertOne({ username, password });

    if (result.insertedCount > 0) {
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
