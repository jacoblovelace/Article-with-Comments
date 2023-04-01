const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// attempt to connect to database and send response message
mongoose.connect(process.env.DB_CONNECT)
.then(() => console.log("Database connected"))
.catch(error => console.log(error));

// import routes
const commentRoute = require('./routes');
app.use('/', commentRoute);

// run server on specified port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server running..."));