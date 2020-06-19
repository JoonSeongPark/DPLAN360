const path = require("path");

const express = require("express");

const app = express();

const sequelize = require("./util/database");

const User = require("./models/user");
const Team = require("./models/team");
const Campaign = require("./models/campaign");
const Advertiser = require("./models/advertiser");
const Medium = require("./models/medium");
const MediaItem = require("./models/media-item");
const Agency = require("./models/agency");
const AdMainCategory = require("./models/ad-main-category");
const AdSubCategory = require("./models/ad-sub-category");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const workRoutes = require("./routes/work");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(workRoutes);

User.belongsTo(Team);
Team.hasMany(User);

Campaign.belongsTo(Team);
Team.hasMany(Campaign);

Campaign.belongsTo(Advertiser);
Advertiser.hasMany(Campaign);

Campaign.belongsToMany(Medium, { through: MediaItem });
Medium.belongsToMany(Campaign, { through: MediaItem });

AdSubCategory.belongsTo(AdMainCategory);
AdMainCategory.hasMany(AdSubCategory);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return Team.findByPk(1);
  })
  .then((team) => {
    if (!team) {
      Team.create({ name: "김나영" }).then((team) => {
        team.createUser({
          name: "박준성",
          email: "rytt@yonsei.ac.kr",
          password: "123",
        });
      });
      Team.create({ name: "조선영" });
      Team.create({ name: "이미선" });
    }
  })
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => {
    return console.log(err);
  });
