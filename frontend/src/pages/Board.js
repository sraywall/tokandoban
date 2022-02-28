import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset, getLists } from "../features/lists/listSlice";
import { getTasks } from "../features/tasks/taskSlice";
import { FaPlusCircle } from "react-icons/fa";
import List from "../components/List";

import AddList from "../components/AddList";

function Board() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { lists, isLoading, isError, message } = useSelector(
    (state) => state.lists
  );
  const { tasks } = useSelector((state) => state.tasks);
  const { state } = useLocation();
  const [addingList, SetAddingList] = useState(false);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!user) {
      navigate("/login");
    }
    dispatch(getLists(state.board_id));
    dispatch(getTasks(state.board_id));
    return () => {
      dispatch(reset());
    };
  }, [state, user, navigate, isError, message, dispatch]);

  if (!state) {
    navigate("/");
  }

  const toggleAddingList = () => {
    SetAddingList(!addingList);
  };

  return (
    <>
      <h1>{state.board_name}</h1>
      <div className="boardView">
        {lists.map((lst) => {
          return <List key={lst.list_id} list={lst} />;
        })}
        {addingList ? (
          <AddList board={{ ...state }} toggleAddingList={toggleAddingList} />
        ) : (
          <div className="addlistbtn">
            <button className=" btn btn-block " onClick={toggleAddingList}>
              <FaPlusCircle />
              Add a List
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Board;
