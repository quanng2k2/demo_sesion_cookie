const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const database = require("./utils/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const session = require("express-session");
// const MySQLStore = require("express-mysql-session")(session);
// const options = {
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "12345678",
//   database: "demo_schema",
// };

// const sessionStore = new MySQLStore(options);

const {
  checkExist,
  checkNotExist,
  isAuth,
} = require("./middlewares/auth.middlewares");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser("secret"));
server.use(express.static("public"));
// server.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     store: sessionStore,
//     // cookie: { secure: true },
//   })
// );

server.get("/", isAuth, (req, res) => {
  console.log(req.cookies);
  res.json({
    message: "Hello world",
  });
});

server.get("/login", (req, res) => {
  res.sendFile(`${__dirname}/public/login.html`);
});

server.post("/api/v1/auth/register", checkExist, async (req, res) => {
  let { email, password } = req.body;
  // Bỏ qua việc validate

  // hash password
  let salt = bcrypt.genSaltSync(10);
  console.log(salt);
  let hash = bcrypt.hashSync(password, salt);
  console.log(hash);
  // lưu bản ghi mới vào trong database

  try {
    let data = await database.execute(
      "INSERT INTO tbl_users(email, password) VALUES(?, ?)",
      [email, hash]
    );
    res.json({
      message: "Register successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

server.post("/api/v1/auth/login", checkNotExist, async (req, res) => {
  let { email, password } = req.body;
  try {
    let data = await database.execute(
      "SELECT * FROM tbl_users WHERE email = ?",
      [email]
    );
    let [find] = data; // [[{}],[]]
    let hash = find[0].password;
    let valid = bcrypt.compareSync(password, hash);
    if (!valid) {
      res.json({
        message: "Password is incorrect",
      });
    } else {
      // res.cookie("userId", find[0].user_id, { signed: true });
      // req.session.userId = find[0].user_id;
      console.log(find);
      console.log(process.env);
      // create token
      let token = jwt.sign({ userId: find[0].user_id }, process.env.SECRET, {
        expiresIn: "5000",
      });
      console.log(token);
      res.json({
        status: "success",
        message: "Login successfully",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      error,
    });
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
