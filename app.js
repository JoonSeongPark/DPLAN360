const path = require("path");

const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const csrf = require("csurf");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");

const compression = require("compression");

const errorController = require("./controllers/error");

const app = express();

const store = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

app.use(compression());

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
      console.log(err);
    });
});

app.use((req, res, next) => {
  if (req.user) {
    res.locals.isLeader = req.user.leader;
    res.locals.isNormal = req.session.isNormal;
    res.locals.isFinance = req.session.isFinance;
  }
  res.locals.isLoggedIn = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAdmin = req.session.isAdmin;
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

Advertiser.belongsTo(AdSubCategory);
AdSubCategory.hasMany(Advertiser);

AdSubCategory.belongsTo(AdMainCategory);
AdMainCategory.hasMany(AdSubCategory);

sequelize
  // .sync({ force: true })
  .sync()
  .then(async () => {
    const email = "leader@d-plan360.com";
    const hashedPassword = await bcrypt.hash("dplan3601", 12);
    User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        if (!user) {
          const admin = new User({
            name: "관리자",
            email,
            password: hashedPassword,
            leader: 1,
          });
          return admin.save();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
