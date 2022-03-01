import { React, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

function Task(props) {
  const { task, task_index } = props;
  return (
    <Draggable draggableId={task.task_id + ""} index={+task_index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task"
        >
          {task.description}
        </div>
      )}
    </Draggable>
  );

  //
}

export default Task;
