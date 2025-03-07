import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface SubmitButtonProps {
  setTasks: React.Dispatch<React.SetStateAction<Todo[]>>;
  editTask: Todo | null;
  editIndex: number | null;
  setEditTask: React.Dispatch<React.SetStateAction<Todo | null>>;
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //  form fields when an edit task is selected
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setShowForm(true);
    }
  }, [editTask]);

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    if (editIndex !== null) {
      // Update existing task
      setTasks((prevTasks) =>
        prevTasks.map((t, i) =>
          i === editIndex ? { ...t, title, description } : t
        )
      );
      setEditTask(null);
      setEditIndex(null);
    } else {
      // Create new todo
      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
        const newTodo = await response.json();
        setTasks((prev) => [...prev, newTodo]);
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }

    setTitle("");
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
          className="font-sans inset-0 flex items-end justify-center absolute bg-opacity-25 bg-black"
        >
          <div className="bg-white p-6 rounded-t-xl w-screen">
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
                className="text-lg bg-[#DBDBDB] rounded-full w-[30px] h-[30px]"
              >
                <MdClose size={25} color="#000000" style={{ margin: "2px" }} />
              </button>
            </div>

            <section className="flex flex-col gap-6">
              <div>
                <label className="text-lg font-medium block mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-3 rounded-md"
                />
              </div>

              <div>
                <label className="text-lg font-medium block mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-3 rounded-md"
                  rows={4}
                />
              </div>

              <button className="bg-[#4884AE] text-white px-4 py-2 rounded-md w-full">
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
