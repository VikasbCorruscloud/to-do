import { useState, useEffect } from "react";
import SubmitButton from "./SubmitButton";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchTodos, updateTodo, deleteTodo } from "../features/todoSlice";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TodoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(
    (state: RootState) => state.todos.tasks
  );
  const completeTasks = useSelector(
    (state: RootState) => state.todos.completeTasks
  );
  const [editTask, setEditTask] = useState<Todo | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Fetch todos from API
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // Move task to completed
  const completeTask = (todo: Todo) => {
    dispatch(
      updateTodo({
        ...todo,
        completed: true,
      })
    );
  };

  // Remove task from completed list
  const removeTodo = (id: number) => {
    dispatch(deleteTodo(id));
  };

  return (
    <div className="flex flex-col h-screen p-3">
      <div className="overflow-auto max-h-[500px] pb-24">
        <h1 className="text-3xl font-bold">Todo App</h1>
        {tasks.length === 0 ? (
          <p className="mt-3 text-xl">No task added! Add task...</p>
        ) : (
          tasks.map((t) => (
            <section
              key={t.id}
              className="relative text-lg p-3 gap-y-3 border rounded-md mt-4 h-[80px] w-full"
            >
              <div className="absolute left-0 top-0 h-[80px] w-2 bg-[#80BBE6] rounded-l-md"></div>

              <div className="flex justify-between items-center pl-4">
                <div
                  className="w-full"
                  onClick={() => {
                    setEditTask(t);
                    setEditIndex(t.id);
                  }}
                >
                  <h1 className="font-bold">{t.title}</h1>
                  <span className="font-light">{t.description}</span>
                </div>
                <button
                  className="border bg-[#F6F6F6] h-[20px] w-[21px] rounded-full"
                  onClick={() => completeTask(t)}
                ></button>
              </div>
            </section>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      <h2 className="text-xl font-semibold mb-3 mt-7">Completed</h2>
      <div className="overflow-auto max-h-[500px] pb-20">
        {completeTasks.map((t) => (
          <section
            key={t.id}
            className="w-full text-lg mt-4 relative h-[80px] p-3 border bg-[#EBEBEB] rounded-md"
          >
            <div className="absolute left-0 top-0 h-[80px] w-[8px] bg-[#80BBE6] rounded-l-md"></div>

            <div className="flex justify-between items-center pl-3">
              <div>
                <h1 className="font-bold">{t.title}</h1>
                <span className="font-light">{t.description}</span>
              </div>
              <button onClick={() => removeTodo(t.id)}>
                <FaRegCircleCheck style={{ color: "#80BBE6" }} size={25} />
              </button>
            </div>
          </section>
        ))}
      </div>

      {/* Task Form */}
      <SubmitButton
        editTask={editTask}
        editIndex={editIndex}
        setEditTask={setEditTask}
        setEditIndex={setEditIndex}
      />
    </div>
  );
};

export default TodoList;
