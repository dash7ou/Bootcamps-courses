const express = require('express');
const dotEnv = require('dotenv');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotEnv.config({
  path: './config/dev.env'
});

const app = express();

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
