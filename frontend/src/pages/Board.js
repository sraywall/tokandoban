import { useState } from "react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset, getLists, moveList } from "../features/lists/listSlice";
import { getTasks, moveTask } from "../features/tasks/taskSlice";
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
  const {
    tasks,
    // isError,
    // message,
  } = useSelector((state) => state.tasks);
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

  const handleDragEnd = ({ source, destination, type }) => {
    if (type === "COLUMN") {
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        console.log("source:", source);
        console.log("destination:", destination);
        const cloneLists = lists.map((lst) => {
          return { ...lst };
        });
        const [temp] = cloneLists.splice(+source.index, 1);
        cloneLists.splice(+destination.index, 0, temp);
        cloneLists.forEach((lst, index) => (lst.list_index = index));
        dispatch(
          moveList({
            ...lists[+source.index],
            list_index: destination.index,
            source: source.index,
            destination: destination.index,
            cloneLists,
          })
        );
      }
      return;
    }

    //Move task
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      console.log(tasks);
      console.log("moved a task!");
      console.log("destination", destination);
      console.log("source", source);
      let destination_list = tasks
        .map((tsk) => {
          return { ...tsk };
        })
        .filter((tsk) => tsk.list_id === +destination.droppableId);
      let source_list = tasks
        .filter((tsk) => tsk.list_id === +source.droppableId)
        .map((tsk) => {
          return { ...tsk };
        });
      let [temp] = source_list.splice(+source.index, 1);
      temp.list_id = +destination.droppableId;
      if (source.droppableId === destination.droppableId) {
        source_list.splice(+destination.index, 0, temp);
        destination_list = source_list;
      } else {
        destination_list.splice(+destination.index, 0, temp);
      }
      source_list.forEach((tsk, index) => (tsk.task_index = index));
      destination_list.forEach((tsk, index) => (tsk.task_index = index));
      console.log("destination list: ", destination_list);
      console.log("source list: ", source_list);
      dispatch(
        moveTask({ destination_list, source_list, destination, source })
      );
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h1>{state.board_name}</h1>
      <Droppable droppableId="board" direction="horizontal" type="COLUMN">
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
