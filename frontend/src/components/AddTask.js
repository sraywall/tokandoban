import { React, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createTask } from "../features/tasks/taskSlice";

function AddTask(props) {
  const [tasks, setTasks] = useState();
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { list_id } = props;
  // const onEnter = (e) => {
  //   // const { text } = this.state;

  //   if (e.keyCode === 13) {
  //     e.preventDefault();
  //     // this.props.onSave(text);
  //   }
  // };
  const onChange = (e) => {
    setText(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("tasks list id: ", list_id);
    dispatch(createTask({ description: text, list_id, task_index: 0 }));
    setText("");
    toggleAddingTask();
  };
  const { toggleAddingTask } = props;

  return (
    <div className="add-task ">
      <div className="task">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              onChange={onChange}
              value={text}
              placeholder="Enter task description"
            ></input>
            <button className="btn btn-block" type="submit">
              Add Task
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleAddingTask();
              }}
              className="close"
            >
              <FaTimesCircle />
            </button>
          </div>
        </form>{" "}
      </div>
      {/* {<EditButtons
        handleSave={() => onSave(text)}
        saveLabel={adding ? "Add card" : "Save"}
        handleDelete={onDelete}
        handleCancel={onCancel}
      />} */}
    </div>
  );
}

export default AddTask;
