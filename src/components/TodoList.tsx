import { useState } from "react";
import SubmitButton from "./SubmitButton";
import { FaRegCircleCheck } from "react-icons/fa6";

const TodoList = () => {
  const [tasks, setTasks] = useState<{ task: string; description: string }[]>(
    []
  );
  const [completeTasks, setCompleteTasks] = useState<
    { task: string; description: string }[]
  >([]);
  const [editTask, setEditTask] = useState<{
    task: string;
    description: string;
  } | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Move task to completed
  const completeTask = (index: number) => {
    setCompleteTasks((prev) => [...prev, tasks[index]]);
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove task from completed list
  const deleteTask = (index: number) => {
    setCompleteTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen p-3">
      <div className="overflow-auto max-h-[500px] pb-24">
        <h1 className="text-3xl font-bold">Todo App</h1>
        {tasks.length === 0 ? (
          <p className=" mt-3 text-xl">No task added! Add task...</p>
        ) : (
          tasks.map((t, index) => (
            <section
              key={index}
              className="relative text-lg p-3 gap-y-3 border border-[#F6F6F6] rounded-md mt-4 h-[80px] w-full"
            >
              <div className="absolute left-0 top-0 h-[80px] w-2 bg-[#80BBE6] rounded-l-md"></div>

              <div className="flex justify-between items-center pl-4 ">
                <div
                  className=" w-full"
                  onClick={() => {
                    setEditTask(t);
                    setEditIndex(index);
                  }}
                >
                  <h1 className="font-bold">{t.task}</h1>
                  <span className=" font-light ">{t.description}</span>
                </div>
                <div>
                  <button 
                  className=" border border-[#C6D0D0] bg-[#F6F6F6] h-[20px] w-[21px] rounded-full  "
                  onClick={() => completeTask(index)}>
                  </button>
                </div>
              </div>
            </section>
          ))
        )}
      </div>

      {/* Completed Tasks */}
      <h2 className="text-xl font-semibold mb-3">Completed</h2>
      <div className="overflow-auto max-h-[500px] pb-20">
        {completeTasks.length === 0 ? (
          <p></p>
        ) : (
          completeTasks.map((t, index) => (
            <section
              key={index}
              className="w-full text-lg mt-4 relative h-[80px] p-3 border border-[#E8E8E8] bg-[#EBEBEB] rounded-md"
            >
              <div className="absolute left-0 top-0 h-[80px] w-[8px] bg-[#80BBE6] rounded-l-md"></div>

              <div className="flex justify-between items-center pl-3">
                <div>
                  <h1 className="font-bold">{t.task}</h1>
                  <span className="font-light">{t.description}</span>
                </div>
                <button onClick={() => deleteTask(index)}>
                  <FaRegCircleCheck style={{ color: "#80BBE6" }} size={25} />
                </button>
              </div>
            </section>
          ))
        )}
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
