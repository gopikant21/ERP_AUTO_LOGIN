require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");

const corsOptions = {
  origin: "*", // Allow all origins, but you might want to restrict this in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these HTTP methods
  allowedHeaders: "Content-Type, Authorization", // Allow these headers
  preflightContinue: false, // Pass preflight checks
  optionsSuccessStatus: 204, // Some browsers (Safari) need 204 status for successful OPTIONS requests
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
const port = 3000;

const mongoUri = process.env.MONGODB_URI; // MongoDB connection string from .env file
let db;

// Connect to MongoDB
MongoClient.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db("IIT_KGP_ERP_LOGIN"); // Replace with your database name
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// POST: Save ERP credentials
app.post("/save-credentials", async (req, res) => {
  const {
    email,
    email_password,
    erp_username,
    erp_password,
    food,
    song,
    school,
  } = req.body;

  try {
    // Insert ERP credentials into the 'erp_credentials' collection
    const result = await db
      .collection("erp_credentials")
      .insertOne({
        email,
        email_password,
        erp_username,
        erp_password,
        food,
        song,
        school,
      });

    if (result.acknowledged === true && result.insertedId) {
      res.status(200).send("Credentials saved successfully");
    } else {
      res.status(500).send("Failed to save credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/get-credentials", async (req, res) => {
  const { email } = req.body; // Assuming you're identifying the user with their email
  console.log(req.body);

  try {
    // Find the user's credentials based on email
    const credentials = await db
      .collection("erp_credentials")
      .findOne({ email });

    if (credentials) {
      // Send the credentials back as the response
      res.status(200).json(credentials);
    } else {
      res.status(404).send("Credentials not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
