if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { DATABASE_URL } = process.env;
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser: (req, res) => {
    const { user_name, email, password } = req.body;
    console.log(
      `user_name: ${user_name}, email:${email}, password:${password}`
    );
    if (!user_name || !email || !password) {
      res.status(400).send("Please add all fields");
    }

    sequelize
      .query(
        `SELECT *
        FROM users
        WHERE email='${email}';
      `
      )
      .then((dbRes) => {
        console.log("response:", dbRes[0].length);
        if (dbRes[0].length !== 0) {
          res.status(400).send("email already being used");
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(password, salt);

          sequelize
            .query(
              `insert into users (user_name, email, password)
              values ('${user_name}', '${email}', '${hashedPassword}');
              select * from users
              where email = '${email}';
          `
            )
            .then((dbRes2) => {
              const { user_id, user_name, email, password } = dbRes2[0][0];
              res.status(201).send({
                user_id,
                user_name,
                email,
                password,
                token: generateToken(user_id),
              });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  },
  loginUser: (req, res) => {
    const { email, password } = req.body;
    sequelize
      .query(
        `SELECT *
        FROM users
        WHERE email='${email}';
      `
      )
      .then((dbRes) => {
        if (
          dbRes[0].length !== 0 &&
          bcrypt.compareSync(password, dbRes[0][0].password)
        ) {
          const { user_id, user_name, email, password } = dbRes[0][0];
          console.log({ user_id, user_name, email, password });
          res.status(200).send({
            user_id,
            user_name,
            email,
            password,
            token: generateToken(user_id),
          });
        } else {
          res.status(400).send("invalid credentials");
        }
      })
      .catch((err) => console.log(err));
  },
  getMe: (req, res) => {},
};
