import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }
  
  interface TodoState {
    tasks: Todo[];
    completeTasks: Todo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }

  // Initial state
const initialState: TodoState = {
  tasks: [],
  completeTasks: [],
  status: 'idle',
  error: null,
};

const API_URL = '/api/todos'; // Use the proxy instead of the full backend URL
//fetch
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get<Todo[]>(API_URL);
  return response.data;
});
//add
export const addTodo = createAsyncThunk('todos/addTodo', async (todo: Omit<Todo, 'id'>) => {
  const response = await axios.post<Todo>(API_URL, todo);
  return response.data;
});
 //update
export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo: Todo) => {
  const response = await axios.put<Todo>(`${API_URL}/${todo.id}`, todo);
  return response.data;
});
//delete
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});


//slice 
const todoSlice = createSlice({
  name:"todos",
  initialState,
  reducers: {},
  extraReducers: (builder)=>{
    builder 
    .addCase(fetchTodos.pending , (state) => {
      state.status='loading';
    })
    .addCase(fetchTodos.fulfilled,(state,action)=>{
      state.status='succeeded';
      state.tasks = action.payload.filter(todo => !todo.completed);
      state.completeTasks = action.payload.filter(todo => todo.completed)
    })
    .addCase(fetchTodos.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message ?? 'Something went wrong';
    })
    //add
    .addCase(addTodo.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    })
    //update 
    .addCase(updateTodo.fulfilled, (state, action) => {
      const updatedTodo = action.payload;
      if (updatedTodo.completed) {
        state.completeTasks.push(updatedTodo);
        state.tasks = state.tasks.filter(todo => todo.id !== updatedTodo.id);
      } else {
        state.tasks = state.tasks.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo));
      }
    })

    //delete
    .addCase(deleteTodo.fulfilled,(state,action) =>{
      state.status='succeeded';
      state.completeTasks = state.completeTasks.filter(todo => todo.id !== action.payload )
    })
  }
})

export default todoSlice.reducer;