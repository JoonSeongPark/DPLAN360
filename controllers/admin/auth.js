const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../../models/user");

const Sequelize = require("sequelize");
const Team = require("../../models/team");
const Op = Sequelize.Op;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let successMessage = req.flash("success");
  if (successMessage.length > 0) successMessage = successMessage[0];
  else successMessage = null;
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  res.render("auth/login", {
    pageTitle: "Login",
    menuTitle: "로그인",
    path: "/login",
    successMessage,
    errorMessage,
    isLoggedIn: null,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: { email: email },
      include: [{ model: Team }],
    });

    if (!user) {
      req.flash("error", "사용자가 존재하지 않습니다.");
      return res.redirect("/login");
    }
    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      if (user.team && user.team.normal) {
        req.session.isNormal = true;
      }
      if (user.team && user.team.name === "재무") {
        req.session.isFinance = true;
      }
      req.session.user = user;
      await req.session.save();
      return res.redirect("/");
    }
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    return res.redirect("/login");
  });
};

exports.getResetPassword = (req, res, next) => {
  let successMessage = req.flash("success");
  if (successMessage.length > 0) successMessage = successMessage[0];
  else successMessage = null;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    menuTitle: "비밀번호 초기화",
    successMessage,
    errorMessage,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postResetPassword = (req, res, next) => {
  const { email } = req.body;
  // token 생성
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      req.flash("error", "토큰 생성을 실패하였습니다.");
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash("error", "입력한 이메일의 사용자는 존재하지 않습니다.");
        res.redirect("/reset-password");
      }
      user.resetToken = token;
      // 한시간동안 유효
      user.resetTokenExpiration = Date.now() + 3600000;

      await user.save();

      req.flash("success", `${email} 으로 메일이 발송되었습니다.`);
      res.redirect("/login");

      transporter.sendMail({
        to: email,
        from: "leader@d-plan360.com",
        subject: "DPLAN 비밀번호 변경",
        html: `
            <p>비밀번호 변경을 요청하였습니다.</p>
            <p>클릭하여 변경화면으로 이동하세요.</p>
            <a href="http://${req.hostname}:3000/new-password/${token}">비밀번호 재설정</a>
          `,
      });
    } catch (err) {
      console.log(err);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const { token } = req.params;

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) errorMessage = errorMessage[0];
  else errorMessage = null;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: Date.now() },
      },
    });

    res.render("auth/new-password", {
      pageTitle: "New Password",
      menuTitle: "비밀번호 재설정",
      successMessage: null,
      errorMessage,
      userId: user.id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const { userId, password, confirmPassword, passwordToken } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    return res.redirect("/new-password");
  }

  try {
    const user = await User.findOne({
      where: {
        id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { [Op.gt]: Date.now() },
      },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    req.flash("success", "비밀번호가 변경되었습니다.");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
