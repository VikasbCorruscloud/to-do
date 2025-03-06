import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
interface SubmitButtonProps {
  setTasks: React.Dispatch<
    React.SetStateAction<{ task: string; description: string }[]>
  >;
  editTask: { task: string; description: string } | null;
  editIndex: number | null;
  setEditTask: React.Dispatch<
    React.SetStateAction<{ task: string; description: string } | null>
  >;
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  setTasks,
  editTask,
  editIndex,
  setEditTask,
  setEditIndex,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");

  //  form fields when an edit task is selected
  useEffect(() => {
    if (editTask) {
      setTask(editTask.task);
      setDescription(editTask.description);
      setShowForm(true);
    }
  }, [editTask]);

  const submitHandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() === "") return;

    if (editIndex !== null) {
      // Update existing task
      setTasks((prevTasks) =>
        prevTasks.map((t, i) => (i === editIndex ? { task, description } : t))
      );
      setEditTask(null);
      setEditIndex(null);
    } else {
      // Add new task
      setTasks((prevTasks) => [...prevTasks, { task, description }]);
    }

    setTask("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <>
      <footer className="fixed bottom-4 left-4 right-4 bg-[#4884AE] h-[48px] rounded-md">
        <button
          onClick={() => setShowForm(true)}
          className="w-full text-white text-center p-3"
        >
          Add Task
        </button>
      </footer>

      {showForm && (
        <form
          onSubmit={submitHandle}
          className="font-sans inset-0 flex items-end  justify-center absolute bg-[#000000] text-black bg-opacity-25"
        >
          <div className="bg-white p-6 rounded-t-xl w-screen ">
            <div className="flex justify-between mb-3">
              <h1 className="text-2xl font-semibold">
                {editTask ? "Edit Task" : "New Task"}
              </h1>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditTask(null);
                  setEditIndex(null);
                }}
                className="text-lg bg-[#DBDBDB] rounded-full w-[30px] h-[30px]  "
              >
                <MdClose size={25} color="#000000" style={{margin:"2px"}}  />

              </button>
            </div>
            <section className=" relative flex h-[396px] flex-col gap-6">
              <div>
                <label className="text-lg font-medium block mt-3 mb-2">Title</label>
                <input
                  type="text"
                  value={task}
                  placeholder="Enter the title of your task"
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full border h-[48px] border-[#D7D7D7] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-lg font-medium mt-2 block mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  placeholder="Enter the description of your task"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-[#D7D7D7] h-[102px] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <button className=" absolute bottom-0 bg-[#4884AE] text-white px-4 py-2 rounded-md w-full h-[48px] md:w-auto">
                {editTask ? "Update Task" : "Submit"}
              </button>
            </section>
          </div>
        </form>
      )}
    </>
  );
};

export default SubmitButton;
