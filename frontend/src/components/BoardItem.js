import React from "react";

function BoardItem({ board }) {
  return (
    <div className="goal">
      <h2>{board.board_name}</h2>
    </div>
  );
}

export default BoardItem;
