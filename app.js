const path = require("path");

const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const csrf = require("csurf");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");

const errorController = require("./controllers/error");

const app = express();

const store = new MySQLStore({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Pjs895623!",
  database: "dplan360",
  clearExpired: true,
});
const csrfProtection = csrf();

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
const saleRoutes = require("./routes/sale");
const campaignRoutes = require("./routes/campaign");
const authRoutes = require("./routes/auth");
const infoRoutes = require("./routes/info");
const taxBillRoutes = require("./routes/tax-bill");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "dplandplan",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      return console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.isLeader = req.session.isLeader;
  next();
});

// routes
app.use("/admin", adminRoutes);
app.use(campaignRoutes);
app.use(saleRoutes);
app.use(authRoutes);
app.use(infoRoutes);
app.use(taxBillRoutes);

app.use(errorController.get404);

// entity relations
User.belongsTo(Team);
Team.hasMany(User);

Campaign.belongsTo(Team);
Team.hasMany(Campaign);

Campaign.belongsTo(Agency);
Agency.hasMany(Campaign);

Campaign.belongsTo(Advertiser);
Advertiser.hasMany(Campaign);

MediaItem.belongsTo(Campaign);
Campaign.hasMany(MediaItem);

MediaItem.belongsTo(Medium);
Medium.hasMany(MediaItem);

// Campaign.belongsToMany(Medium, { through: MediaItem });
// Medium.belongsToMany(Campaign, { through: MediaItem });

AdSubCategory.belongsTo(AdMainCategory);
AdMainCategory.hasMany(AdSubCategory);

sequelize
  // .sync({ force: true })
  .sync()
  .then(async () => {
    const email = "admin@d-plan360.com";
    const hashedPassword = await bcrypt.hash("123", 12);
    const admin = new User({
      name: "관리자",
      email,
      password: hashedPassword,
      leader: 1,
    });
    return admin.save();
  })
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => {
    return console.log(err);
  });
