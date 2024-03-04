const express=require('express');
const app=express();
const dbConnect=require('./config/dbcon')
const logger = require('./middlewares/logger');
const { addAdmin } = require('./controllers/addAdmin');
const { notFound, errorHandler } = require('./middlewares/errors');
const path =require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);  // display the requests in console

//helmet: it adds headers to the request for more security
app.use(helmet());
// cors: used for port security
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));

// Use cookie-parser middleware
app.use(cookieParser());

// Serve static files from the "uploads" directory
const Imgpath = require('path');
app.use('/uploads', express.static(Imgpath.join(__dirname, 'uploads')));

// for routes


//Error handler Middleware
app.use(notFound);
app.use(errorHandler);

dbConnect()
.then(() => {
    // The database connection is successful, you can start your app logic here
    // e.g., start the server
    app.listen(process.env.PORT, () => {
        console.log('App is listening on port ' + process.env.PORT);
    });

    addAdmin();
})
.catch((error) => {
    // Handle error (e.g., log the error or exit the application)
    console.error('Error connecting to the database:', error.message);
});