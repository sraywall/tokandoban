import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "./taskService";

const initialState = {
  tasks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, thunkAPI) => {
    try {
      // const board_id = thunkAPI.getState().auth.user.user_id;
      // const index = thunkAPI.getState().lists.lists.length;
      // console.log("task index: " + index);
      // console.log("Board Id: " + listData.board_id);

      // listData.list_index = index;
      return await taskService.createTask(taskData, taskData.list_id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//get tasks
export const getTasks = createAsyncThunk(
  "tasks/getAll",
  async (board_id, thunkAPI) => {
    try {
      // const board_id = thunkAPI.getState().auth.user.user_id;
      return await taskService.getTasks(board_id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const moveTask = createAsyncThunk(
  "tasks/move",
  async ({ destination_list, source_list, destination, source }, thunkAPI) => {
    Promise.all(
      destination_list.map((tsk) => taskService.updateTask(tsk, tsk.task_id))
    )
      .then(() => {})
      .catch((error) => {
        console.log("error");
        console.log(error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      });
    Promise.all(
      source_list.map((tsk) => taskService.updateTask(tsk, tsk.task_id))
    )
      .then(() => {})
      .catch((error) => {
        console.log("error");
        console.log(error);
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(message);
      });
    return { destination_list, source_list, destination, source };
  }
);
// export const deleteBoard = createAsyncThunk(
//   "boards/delete",
//   async (board_id, thunkAPI) => {
//     try {
//       const user_id = thunkAPI.getState().auth.user.user_id;
//       return await boardService.deleteBoard(board_id);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(moveTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(moveTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { destination_list, source_list, destination, source } =
          action.payload;
        console.log("slice destination_list:", destination_list);
        console.log("slice source_list:", source_list);
        console.log("slice source:", source);
        console.log("slice destination:", destination);
        state.tasks = state.tasks.filter(
          (tsk) => tsk.list_id !== +source.droppableId
        );
        console.log("filter_source:", state.tasks);
        state.tasks.push(...source_list);

        if (source.droppableId !== destination.droppableId) {
          //different lists
          state.tasks = state.tasks.filter(
            (tsk) => tsk.list_id !== +destination.droppableId
          );
          console.log("filter_destination", state.tasks);
          state.tasks.push(...destination_list);
        }
        console.log("at the end:", state.tasks);
      })
      .addCase(moveTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.log(state.message);
        state.message = action.payload;
      });
    // .addCase(deleteBoard.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(deleteBoard.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.boards = state.boards.filter(
    //     (board) => board.board_id !== action.payload.board_id
    //   );
    // })
    // .addCase(deleteBoard.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload;
    // });
  },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;
