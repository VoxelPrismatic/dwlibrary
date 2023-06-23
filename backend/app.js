const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const routes = require('./routes/api')
  //port
const port = process.env.port || 9000



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
      
      app.use(morgan.json());
      
      app.use('/api', routes);
      
      app.use((err, req, res, next) => {
        console.log(err);
        next();
      });
      
  

    app.listen(port, () => {
        console.log(` Server running on ${port}`)
    })