require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// استخدم الـ ID الصحيح هنا
const OBJECT_ID = '2-194395742';

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Route 1: Homepage - GET all Pets
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}?properties=name,bio,age`,
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const pets = response.data.results;
    res.render('homepage', { title: 'Pets List | Practicum', pets });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).send(`Error: ${error.response?.data?.message || error.message}`);
  }
});

// Route 2: Show form
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Route 3: Create new Pet
app.post('/update-cobj', async (req, res) => {
  const { name, bio, age } = req.body;
  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`,
      { properties: { name, bio, age } },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.redirect('/');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).send(`Error: ${error.response?.data?.message || error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
