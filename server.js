const express = require('express');
const dotEnv = require('dotenv');

// Load env vars
dotEnv.config({ path: './config/dev.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
