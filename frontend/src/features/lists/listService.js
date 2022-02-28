import axios from "axios";

const API_URL = "/lists/";

const createList = async (listData, board_id) => {
  const response = await axios.post(API_URL + `${board_id}`, listData);

  return response.data;
};

//get board lists
const getLists = async (board_id) => {
  const response = await axios.get(API_URL + `${board_id}`);
  console.log(response);
  return response.data;
};

//delete list
const deleteList = async (list_id) => {
  const response = await axios.delete(API_URL + `${list_id}`);
  return response.data;
};

const updateList = async (listData, list_id) => {
  const response = await axios.put(API_URL + `${list_id}`, listData);

  return response.data;
};
const listService = {
  createList,
  getLists,
  deleteList,
  updateList,
};
export default listService;
