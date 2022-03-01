import axios from "axios";

const API_URL = "/tasks/";

const createTask = async (taskData, list_id) => {
  const response = await axios.post(API_URL + `${list_id}`, taskData);

  return response.data;
};

const updateTask = async (taskData, task_id) => {
  const response = await axios.put(API_URL + `${task_id}`, taskData);
  return response.data;
};

//get board tasks
const getTasks = async (board_id) => {
  const response = await axios.get(API_URL + `${board_id}`);
  console.log(response);
  return response.data;
};

// //delete list
// const deleteList = async (list_id) => {
//   const response = await axios.delete(API_URL + `${list_id}`);
//   return response.data;
// };

const taskService = {
  createTask,
  getTasks,
  updateTask,
  // deleteList,
};
export default taskService;
