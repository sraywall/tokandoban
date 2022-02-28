if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { DATABASE_URL } = process.env;
console.log(DATABASE_URL);
const Sequelize = require("sequelize");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  getBoards: (req, res) => {
    const { user_id } = req.params;
    sequelize
      .query(
        `SELECT *
        FROM boards
        WHERE user_id = ${user_id};
      `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  getLists: (req, res) => {
    const { board_id } = req.params;

    sequelize
      .query(
        `SELECT *
        FROM lists
        WHERE board_id = ${board_id};
      `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  getTasks: (req, res) => {
    const { board_id } = req.params;
    sequelize
      .query(
        `select tasks.task_id,tasks.list_id,tasks.description,tasks.task_index
        from tasks
        join lists on tasks.list_id = lists.list_id
        where board_id = ${board_id} ;
      `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  createBoard: (req, res) => {
    const { user_id } = req.params;
    const { board_name } = req.body;
    sequelize
      .query(
        `insert into boards (user_id,board_name)
        values (${user_id},'${board_name}')
        returning *;
        `
      )
      .then((dbRes) => {
        console.log(dbRes);
        res.status(201).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  createList: (req, res) => {
    const { board_id } = req.params;
    const { list_name, list_index } = req.body;
    sequelize
      .query(
        `insert into lists (board_id,list_name,list_index)
        values (${board_id},'${list_name}',${list_index})
        returning *;
        `
      )
      .then((dbRes) => {
        res.status(201).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  createTask: (req, res) => {
    const { list_id } = req.params;
    const { description, task_index } = req.body;
    sequelize
      .query(
        `insert into tasks (list_id,description,task_index)
        values (${list_id},'${description}',${task_index})
        returning *;
        `
      )
      .then((dbRes) => {
        res.status(201).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  updateBoard: (req, res) => {
    const { board_id } = req.params;
    const { board_name } = req.body;
    sequelize
      .query(
        `UPDATE boards
        SET board_name = '${board_name}'
        WHERE board_id = ${board_id};
        `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  updateList: (req, res) => {
    const { list_id } = req.params;
    const { list_name, list_index } = req.body;
    sequelize
      .query(
        `UPDATE lists
        SET list_name = '${list_name}',list_index = ${list_index}
        WHERE list_id = ${list_id};
        `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  updateTask: (req, res) => {
    const { task_id } = req.params;
    const { description, task_index } = req.body;
    sequelize
      .query(
        `UPDATE tasks
        SET description = '${description}',task_index = ${task_index}
        WHERE task_id = ${task_id};
        `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
  deleteBoard: (req, res) => {
    const { board_id } = req.params;
    sequelize
      .query(
        `DELETE FROM boards WHERE board_id = ${board_id}
        returning *;
        DELETE FROM lists WHERE board_id = ${board_id};
      `
      )
      .then((dbRes) => {
        console.log(dbRes[0]);
        res.status(200).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  deleteList: (req, res) => {
    const { list_id } = req.params;
    sequelize
      .query(
        `
        DELETE FROM tasks WHERE list_id = ${list_id};
        DELETE FROM lists WHERE list_id = ${list_id}
        returning *;
      `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0][0]);
      })
      .catch((err) => console.log(err));
  },
  deleteTask: (req, res) => {
    const { task_id } = req.params;
    sequelize
      .query(
        `DELETE FROM tasks WHERE task_id = ${task_id};
      `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      })
      .catch((err) => console.log(err));
  },
};
