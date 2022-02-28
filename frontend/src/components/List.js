import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddTask from "./AddTask";
import {
  FaPlusCircle,
  FaTrash,
  FaTrashAlt,
  FaRegTrashAlt,
} from "react-icons/fa";
import { deleteList } from "../features/lists/listSlice";

function List(props) {
  const { list } = props;
  const { tasks, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );
  const dispatch = useDispatch();
  const [addingTask, setAddingTask] = useState(false);
  const toggleAddingTask = () => {
    setAddingTask(!addingTask);
  };
  return (
    <>
      <div className="list">
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
        <ul>
          {tasks
            .filter((tsk) => tsk.list_id === list.list_id)
            .map((tsk) => {
              return <li>{tsk.description}</li>;
            })}
        </ul>
        {addingTask ? (
          <AddTask list_id={list.list_id} toggleAddingTask={toggleAddingTask} />
        ) : (
          <div className="toggle-add-task" onClick={toggleAddingTask}>
            <FaPlusCircle /> Add a task
          </div>
        )}
      </div>
    </>
  );
}

export default List;
