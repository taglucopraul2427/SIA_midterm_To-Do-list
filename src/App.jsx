import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient" // Import the client
import "./styles.css"
import { NewTodoform } from "./NewTodoForm"
import { TodoList } from "./TodoList"

export default function App() {
  const [todos, setTodos] = useState([])

  // 1. Fetch initial data from Supabase
  useEffect(() => {
    async function getTodos() {
      const { data } = await supabase.from("todos").select("*").order("created_at")
      if (data) setTodos(data)
    }
    getTodos()
  }, [])

  // 2. Add to Database
  async function addTodo(title) {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, completed: false }])
      .select()

    if (data) {
      setTodos((currentTodos) => [...currentTodos, data[0]])
    }
  }

  // 3. Update in Database
  async function toggleTodo(id, completed) {
    const { error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id)

    if (!error) {
      setTodos(currentTodos => 
        currentTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo))
      )
    }
  }

  // 4. Delete from Database
  async function deleteTodo(id) {
    const { error } = await supabase.from("todos").delete().eq("id", id)

    if (!error) {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id))
    }
  }

  return (
    <>
      <NewTodoform onSubmit={addTodo} />
      <h1 className="header">Todo List</h1>
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
    </> 
  )
}