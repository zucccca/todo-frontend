import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const allTodos = await fetch("http://localhost:3001/todos");
      const data = await allTodos.json();

      setTodos(data.todos);
    };
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:3001/todos";
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
    const url = `http://localhost:3001/todos/${id}`;
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
    const url = `http://localhost:3001/todos/${id}`;
    await fetch(url, { method: "DELETE" });
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const renderTodos = () => {
    return (
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => handleToggle(todo)}>
            <input type="checkbox" checked={todo.completed} readOnly />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(todo.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="App">
      {todos.length ? renderTodos() : <h1>Fetching todos...</h1>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="todo">Add todo</label>
        <input
          type="text"
          name="todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
