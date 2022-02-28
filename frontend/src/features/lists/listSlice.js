import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import listService from "./listService";

const initialState = {
  lists: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createList = createAsyncThunk(
  "lists/create",
  async (listData, thunkAPI) => {
    try {
      // const board_id = thunkAPI.getState().auth.user.user_id;
      const index = thunkAPI.getState().lists.lists.length;
      console.log("list index: " + index);
      console.log("Board Id: " + listData.board_id);

      listData.list_index = index;
      return await listService.createList(listData, listData.board_id);
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

//get lists
export const getLists = createAsyncThunk(
  "lists/getAll",
  async (board_id, thunkAPI) => {
    try {
      // const board_id = thunkAPI.getState().auth.user.user_id;
      return await listService.getLists(board_id);
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

export const deleteList = createAsyncThunk(
  "lists/delete",
  async (list_id, thunkAPI) => {
    try {
      // const user_id = thunkAPI.getState().auth.user.user_id;
      return await listService.deleteList(list_id);
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

export const moveList = createAsyncThunk(
  "lists/move",
  async (list, thunkAPI) => {
    try {
      console.log("cloned lists:");
      console.log(list.cloneLists);
      console.log("cloned list size:", list.cloneLists.length);
      console.log("list names");
      list.cloneLists.forEach((lst) =>
        console.log("list name:", lst.list_name)
      );
      console.log("first list!");
      console.log(list.cloneLists[0]);
      // const user_id = thunkAPI.getState().auth.user.user_id;
      return await Promise.all(
        list?.cloneLists?.map((lst) => listService.updateList(lst, lst.list_id))
      );
      // const res = [];
      // for (const lst of list.cloneLists) {
      //   res.push(await listService.updateList(lst, lst.list_index));
      // }
      // const cloneLists = list.cloneLists.map((lst) => {
      //   return { ...lst };
      // });
      // await Promise.all(
      //   cloneLists?.map((lst) => listService.updateList(lst, lst.list_id))
      // );
      // return await listService.updateList(list, list.list_id);
      // console.log("res!!!!!");
      // console.log(res);
      // return list.cloneLists;
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
export const updateList = createAsyncThunk(
  "lists/update",
  async (list, thunkAPI) => {
    try {
      // const user_id = thunkAPI.getState().auth.user.user_id;
      return await listService.updateList(list, list.list_id);
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

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lists.push(action.payload);
      })
      .addCase(createList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getLists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lists = action.payload;
      })
      .addCase(getLists.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lists = state.lists.filter(
          (list) => list.list_id !== action.payload.list_id
        );
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(moveList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(moveList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log("payload:");
        console.log(action.payload);
        state.lists = action.payload;
        // const source = action.payload.source;
        // const destination = action.payload.destination;
        // const [temp] = state.lists.splice(source, 1);
        // temp.list_index = destination;
        // state.lists.splice(destination, 0, temp);
        // state.lists.forEach((lst, index) => (lst.list_index = index));
      })
      .addCase(moveList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = listSlice.actions;
export default listSlice.reducer;
