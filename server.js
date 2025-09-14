require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/router');

const vxlApp = express();
require('./DB/connection');

// ✅ Just use basic CORS - this often works without additional configuration
vxlApp.use(cors());

vxlApp.use(express.json());
vxlApp.use(router);

const PORT = process.env.PORT || 3000;

vxlApp.listen(PORT, () => {
  console.log(`VXL-App started running at ${PORT}`);
});

vxlApp.get('/', (req, res) => {
  res.send('<h3>vxl application start running and waiting for the client request...</h3>');
});