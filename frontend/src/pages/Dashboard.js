import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { Spinner } from "../components/Spinner";
import Spinner from "../components/Spinner";
import BoardForm from "../components/BoardForm";
import BoardItem from "../components/BoardItem";
import { reset, getBoards } from "../features/boards/boardSlice";
function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { boards, isLoading, isError, message } = useSelector(
    (state) => state.board
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (!user) {
      navigate("/login");
    }
    dispatch(getBoards());
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.user_name}</h1>
        <p>Dashboard</p>
      </section>
      <BoardForm />
      <section className="content">
        {boards.length > 0 ? (
          <div className="goals">
            {boards.map((board) => (
              <BoardItem key={board._id} board={board} />
            ))}
          </div>
        ) : (
          <h3>You have not set any goals</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
