import { useState } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset, getLists, moveList } from "../features/lists/listSlice";
import { getTasks } from "../features/tasks/taskSlice";
import { FaPlusCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  const handleDragEnd = (result) => {
    console.log(result);
    console.log("source:" + result.source.index);
    console.log("destination:" + result.destination.index);
    const cloneLists = lists.map((lst) => {
      return { ...lst };
    });
    const source = result.source.index;
    const destination = result.destination.index;
    const [temp] = cloneLists.splice(+source, 1);
    cloneLists.splice(+destination, 0, temp);
    cloneLists.forEach((lst, index) => (lst.list_index = index));
    dispatch(
      moveList({
        ...lists[+source],
        list_index: destination,
        source,
        destination,
        cloneLists,
      })
    );
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h1>{state.board_name}</h1>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <div
            className="boardView"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {lists.map((lst, index) => {
              return (
                <Draggable
                  draggableId={lst.list_id + ""}
                  index={index}
                  key={lst.list_id}
                >
                  {(provided) => (
                    <List
                      provided={provided}
                      innerRef={provided.innerRef}
                      list={lst}
                    />
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            {addingList ? (
              <AddList
                board={{ ...state }}
                toggleAddingList={toggleAddingList}
              />
            ) : (
              <div className="addlistbtn">
                <button className=" btn btn-block " onClick={toggleAddingList}>
                  <FaPlusCircle />
                  Add a List
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
{
  /* <DragDropContext onDragEnd={() => {}}>
<Droppable droppableId="board" direction="horizontal">
  {(provided) => {
    <div {...provided.droppableProps} ref={provided.innerRef}>
      <div className="boardView">
        {lists.map((lst) => {
          return <List key={lst.list_id} list={lst} />;
        })}
        {addingList ? (
          <AddList
            board={{ ...state }}
            toggleAddingList={toggleAddingList}
          />
        ) : (
          <div className="addlistbtn">
            <button
              className=" btn btn-block "
              onClick={toggleAddingList}
            >
              <FaPlusCircle />
              Add a List
            </button>
          </div>
        )}
      </div>
    </div>;
  }}
</Droppable>
</DragDropContext> */
}
