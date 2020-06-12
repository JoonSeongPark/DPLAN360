const path = require('path')

const express = require("express");

const app = express();

const sequelize = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");


const workRoutes = require("./routes/work")

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(workRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    return console.log(err);
  });
