import React, { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'; // Import Firestore functions
import axios from 'axios';
import { auth } from '../firebase/firebase.js'; // Import Auth instance

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // Step 2

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in, fetch their todos
        // const userTodosRef = collection(getFirestore(), 'users', user.uid, 'todos');
        // const querySnapshot = await getDocs(userTodosRef);
        // const todosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // setTodos(todosData);
        try {
          const response = await axios.get(`http://localhost:8000/tasks`);
          setTodos(response.data);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      } else {
        // No user is signed in, clear todos
        setTodos([]);
      }
    });

    return unsubscribe; // Unsubscribe from auth state changes when component unmounts
  }, []);


  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await axios.get('http://localhost:8000/tasks/');
      console.log("Fetched todos:", response.data); // Check fetched data in console
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  }

  async function addTodo(task) {
    if (!task.trim()) {
      alert("Please input the new task title");
      return;
    }
    try {
      await axios.post('http://localhost:8000/tasks/', {
        title: task,
        completed: false,
      });
      setTodos(""); // Reset the new task input
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error('Failed to add task', error);
    }
  }

  const toggleComplete = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/tasks/${id}/toggle`);
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${id}/`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    try {
      const response = await axios.put(`http://localhost:8000/tasks/${id}`, { title: task, isEditing: false });
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'inProgress') return !todo.completed;
    if (filter === 'completed') return todo.completed;
  });

  return (
    <div className="TodoWrapper">
      <h1>To Do List !</h1>
      <TodoForm addTodo={addTodo} />
      <div className="filter-options">
        <button
          className={`filter-option ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-option ${filter === 'inProgress' ? 'active' : ''}`}
          onClick={() => setFilter('inProgress')}
        >
          In Progress
        </button>
        <button
          className={`filter-option ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Render todos based on the filteredTodos array */}
      {filteredTodos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
