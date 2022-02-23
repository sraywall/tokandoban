require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const {
  getBoards,
  getLists,
  getTasks,
  createBoard,
  createList,
  createTask,
  updateBoard,
  updateList,
  updateTask,
  deleteBoard,
  deleteList,
  deleteTask,
} = require("./controller.js");
app.use(express.json());
app.use(cors());
//Entries
app.get("/boards", getBoards);
app.get("/lists", getLists);
app.get("/tasks", getTasks);

app.post("/boards/:user_id", createBoard);
app.post("/lists/:board_id", createList);
app.post("/tasks/:list_id", createTask);

app.put("/boards/:board_id", updateBoard);
app.put("/lists/:list_id", updateList);
app.put("/tasks/:task_id", updateTask);

app.delete("/boards/:board_id", deleteBoard);
app.delete("/lists/:list_id", deleteList);
app.delete("/tasks/:task_id", deleteTask);

const port = process.env.PORT || 4005;
app.listen(port, () => console.log(`up on ${port}`));
// app.get('/', (req,res)=>{
//   res.sendFile(path.join(__dirname,'../index.html'))
// })
// app.get('/css', (req,res)=>{
//   res.sendFile(path.join(__dirname,'../styles.css'))
// })
// app.get('/js', (req,res)=>{
//   res.sendFile(path.join(__dirname,'../index.js'))
// })
