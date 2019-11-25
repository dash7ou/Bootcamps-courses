const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env vars
dotEnv.config({
  path: './config/dev.env'
});

const app = express();

// connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

//Body parser
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload
app.use(fileUpload());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

// Cookie parser
app.use(cookieParser());

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // close server
  server.close(() => process.exit(1));
});



console.log("mohammed")