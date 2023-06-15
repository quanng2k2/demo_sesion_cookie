const database = require("../utils/database");
const jwt = require("jsonwebtoken");
module.exports.checkExist = async (req, res, next) => {
  let { email } = req.body;

  try {
    let data = await database.execute(
      "SELECT * FROM tbl_users WHERE email = ?",
      [email]
    );
    let [find] = data;
    if (find.length > 0) {
      res.json({
        message: "User already exists",
      });
    } else {
      next();
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};

module.exports.checkNotExist = async (req, res, next) => {
  let { email } = req.body;

  try {
    let data = await database.execute(
      "SELECT * FROM tbl_users WHERE email = ?",
      [email]
    );
    let [find] = data;
    if (find.length === 0) {
      res.json({
        message: "Email haven't been registed",
      });
    } else {
      next();
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};

// restrictTo("admin", "editor", "user")
module.exports.restrictTo = function (req, res, next) {};

module.exports.isAuth = function (req, res, next) {
  // console.log("Hellooooooooooooooooo", req.session.userId);
  // console.log(req.session);
  // database.execute("SELECT * FROM sessions").then((data) => {
  //   console.log(data);
  // });

  // Tiến hành bảo vệ các endpoint cần thiết
  // Tiến hành truy vấn với userId được đính kèm tại cookie
  // Nếu tồn tại user ---> next sang các tác vụ tiếp theo

  // Nếu không ---> res về user is not authenticated

  // Token verify
  // Lôi token ra
  // verify thằng token
  // Nếu token hợp lệ
  // ----> Tiến hành tìm kiếm user xem nó có tồn tại trong db hay không
  // ----> next sang các request tiếp theo
  try {
    let authorization = req.headers.authorization.split(" ");
    if (authorization.includes("Bearer") && authorization.length > 1) {
      let token = authorization[1];
      let decoded = jwt.verify(token, process.env.SECRET);
      // jwt verified
      let { userId } = decoded;
      // lôi user ra xem còn không
      database
        .execute("SELECT * FROM tbl_users WHERE user_id = ?", [userId])
        .then((data) => {
          let [users] = data;
          // next()

          // res.json // user is not authenticated
        })
        .catch((err) => {
          res.json({
            err,
          });
        });
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};
