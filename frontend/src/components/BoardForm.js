import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createBoard } from "../features/boards/boardSlice";
import { FaPlusCircle } from "react-icons/fa";

function BoardForm() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createBoard({ board_name: text }));
    setText("");
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            placeholder="Enter board name"
            type="text"
            name="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            <FaPlusCircle />
            Add Board
          </button>
        </div>
      </form>
    </section>
  );
}

export default BoardForm;
