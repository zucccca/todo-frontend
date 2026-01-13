import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const allTodos = await fetch("https://todo-api-v4b3.onrender.com/todos");
      const data = await allTodos.json();

      setTodos(data.todos);
    };
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "https://todo-api-v4b3.onrender.com/todos";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todo }),
    });

    const createdTodo = await response.json();
    setTodos([...todos, createdTodo]);
    setTodo("");
  };

  const handleToggle = async (todo) => {
    const { id, completed } = todo;
    const url = `https://todo-api-v4b3.onrender.com/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    });

    const updatedTodo = await response.json();
    const updatedTodos = todos.map((todo) => {
      if (todo.id === updatedTodo.id) {
        return { ...todo, completed: updatedTodo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleDelete = async (id) => {
    const url = `https://todo-api-v4b3.onrender.com/${id}`;
    await fetch(url, { method: "DELETE" });
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const renderTodos = () => {
    return (
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            className="todo-item"
            key={todo.id}
            onClick={() => handleToggle(todo)}
          >
            <div className="todo-content">
              <input type="checkbox" checked={todo.completed} readOnly />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            </div>
            <button
              className="todo-delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(todo.id);
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="App">
      <div className="todo-container">
        <h1>My Todos</h1>
        {todos.length ? renderTodos() : <h1>Fetching todos...</h1>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="todo" className="todo-input">
            Add todo:
          </label>
          <input
            type="text"
            name="todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="todo-input"
          />
          <button type="submit" className="todo-submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
