const express = require("express");
const database=require("./config/database");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const cors=require("cors");

const RouteV1=require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

database.connect();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
//Version1 Route
RouteV1(app);
//End Version1 Route
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});