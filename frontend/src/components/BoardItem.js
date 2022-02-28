import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteBoard } from "../features/boards/boardSlice";
import { useNavigate } from "react-router-dom";

function BoardItem({ board }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleClick(e) {
    navigate("/board", { state: board });
  }
  return (
    <div className="board" onClick={handleClick}>
      <h2>{board.board_name}</h2>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(deleteBoard(board.board_id));
        }}
        className="close"
      >
        <FaTimesCircle />
      </button>
    </div>
  );
}

export default BoardItem;
