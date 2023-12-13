const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Import bodyParser module
require("dotenv").config();
const cors = require('cors');
const routes = require('./routes/api');

// Port
const port = process.env.PORT || 9000;

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Increase the limit of request payload size
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit value as needed
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
