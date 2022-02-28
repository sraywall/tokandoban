import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createList } from "../features/lists/listSlice";
import { FaTimesCircle } from "react-icons/fa";

function AddList(props) {
  const dispatch = useDispatch();
  const { toggleAddingList, board } = props;
  console.log("board_id:" + board.board_id);
  const [list_name, setListName] = useState("");
  const onChange = (e) => {
    setListName(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createList({ list_name, board_id: board.board_id }));
    setListName("");
    toggleAddingList();
  };
  return (
    <div className="addlist">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            style={{ paddingTop: "10" }}
            onChange={onChange}
            value={list_name}
            placeholder="Enter name of list"
          ></input>
          <button className="btn btn-block" type="submit">
            Add List
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAddingList();
            }}
            className="close"
          >
            <FaTimesCircle />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddList;
