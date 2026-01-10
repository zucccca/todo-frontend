import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      const allTodos = await fetch("http://localhost:3001/todos");
      const data = await allTodos.json();
      console.log("data", data);

      setTodos(data.todos);
    };
    fetchTodos();
  }, []);

  const renderTodos = () => {
    return (
      <ul>
        {todos.map((todo) => (
          <li>{todo.title}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="App">
      {todos.length ? renderTodos() : <h1>Fetching todos...</h1>}
    </div>
  );
}

export default App;
