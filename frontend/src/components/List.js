import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";
import AddTask from "./AddTask";
import Task from "../components/Task";
import {
  FaPlusCircle,
  FaTrash,
  FaTrashAlt,
  FaRegTrashAlt,
} from "react-icons/fa";
import { deleteList } from "../features/lists/listSlice";

function List(props) {
  const { list, provided, innerRef } = props;
  const { tasks, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );
  const dispatch = useDispatch();
  const [addingTask, setAddingTask] = useState(false);
  const toggleAddingTask = () => {
    setAddingTask(!addingTask);
  };
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={innerRef}
      className="list"
    >
      <div className="list-name">
        {list.list_name}{" "}
        <button
          className="listclose"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteList(list.list_id));
          }}
        >
          <FaTrash />
        </button>
      </div>
      <Droppable droppableId={list.list_id + ""}>
        {(provided, _snapshot) => (
          <div ref={provided.innerRef}>
            {tasks
              .filter((tsk) => tsk.list_id === list.list_id)
              .map((tsk, index) => {
                return <Task key={tsk.task_id} task_index={index} task={tsk} />;
              })}
            {provided.placeholder}

            {addingTask ? (
              <AddTask
                list_id={list.list_id}
                toggleAddingTask={toggleAddingTask}
              />
            ) : (
              <div className="toggle-add-task" onClick={toggleAddingTask}>
                <FaPlusCircle /> Add a task
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default List;
