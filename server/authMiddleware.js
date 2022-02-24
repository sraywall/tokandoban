if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { DATABASE_URL } = process.env;

const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const protect = (req, res, next) => {
  console.log("Got here in middleware!");

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.log("not authorized, no token");
      res.status(401).send("Not authorize, no token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`we has token!${decoded.id}`);

    sequelize
      .query(`Select * from users where user_id=${decoded.id};`)
      .then((dbRes) => {
        req.user = dbRes[0][0];
        res.status(401).send(dbRes[0][0]);
        next();
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  }
};

module.exports = { protect };
