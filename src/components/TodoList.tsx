import { useState ,useEffect } from "react";
import SubmitButton from "./SubmitButton";
import { FaRegCircleCheck } from "react-icons/fa6";

interface Todo{
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
const TodoList = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [completeTasks, setCompleteTasks] = useState<Todo[]>([]);
  const [editTask, setEditTask] = useState<Todo | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

    // Fetch todos from API
    useEffect(() => {
      const fetchTodos = async () => {
        try {
          const response = await fetch("/api/todos");
          const data = await response.json();
          setTasks(data.filter((todo: Todo) => !todo.completed));
          setCompleteTasks(data.filter((todo: Todo) => todo.completed));
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };
  
      fetchTodos();
    }, []);

  // Move task to completed
  const completeTask = async (todo: Todo) => {
    setCompleteTasks((prev) => [...prev, todo]);
    setTasks((prev) => prev.filter((t) => t.id !== todo.id));
  };

  // Remove task from completed list
  const deleteTask = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setCompleteTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
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
                <div className="w-full" onClick={() => setEditTask(t)}>
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
      <h2 className="text-xl font-semibold mb-3">Completed</h2>
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
              <button onClick={() => deleteTask(t.id)}>
                <FaRegCircleCheck style={{ color: "#80BBE6" }} size={25} />
              </button>
            </div>
          </section>
        ))}
      </div>

      {/* Task Form */}
      <SubmitButton
        setTasks={setTasks}
        editTask={editTask}
        editIndex={editIndex}
        setEditTask={setEditTask}
        setEditIndex={setEditIndex}
      />
    </div>
  );
};

export default TodoList;
