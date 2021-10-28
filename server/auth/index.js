const jwt = require("jsonwebtoken");

function authManager() {
  verify = function (req, res, next) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          loggedIn: false,
          user: null,
          errorMessage: "Unauthorized",
        });
      }

      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verified.userId;

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({
        errorMessage: "Unauthorized",
      });
    }
  };

  signToken = function (user) {
    return jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
  };

  //HD
  getUserId = function (req) {
    try {
      const token = req.cookies.token;
      if (!token) {
        console.log("[AuthIndex.js:authManager.getUserId] token is not valid");
        return req;
      }
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log(
        "[AuthIndex.js:authManager.getUserId] found user id = " +
          verified.userId
      );
      return verified.userId;
    } catch (err) {
      console.log(
        "[AuthIndex.js:authManager.getUserId] Error = " + JSON.stringify(err)
      );
      console.error(err);
      return null;
    }
  };
  return this;
}

const auth = authManager();
module.exports = auth;
