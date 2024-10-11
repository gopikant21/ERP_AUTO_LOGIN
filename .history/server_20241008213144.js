const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Mock database (replace with actual database)
const users = [{ email: 'test@example.com', password: 'password123' }];
const credentials = [];

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.post('/save-credentials', (req, res) => {
  const { username, password } = req.body;
  credentials.push({ username, password });
  res.status(200).send('Credentials saved');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
