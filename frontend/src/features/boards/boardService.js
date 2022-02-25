import axios from "axios";

const API_URL = "/boards/";

const createBoard = async (boardData, user_id) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const response = await axios.post(API_URL + `${user_id}`, boardData);

  return response.data;
};

//get user boards
const getBoards = async (user_id) => {
  const response = await axios.get(API_URL + `${user_id}`);
  console.log(response);
  return response.data;
};

const boardService = {
  createBoard,
  getBoards,
};
export default boardService;
