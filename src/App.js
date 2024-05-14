import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter and other necessary components
import Login from "./components/auth/login"; // Import the Login component
import Register from "./components/auth/register"; // Import the Register component
import { AuthProvider } from "./contexts/authContext"; // Import the AuthProvider
import Profile from "./components/Profile";
import TodoPic from "./components/TodoPic";

function App() {
  return (
    <AuthProvider> {/* Wrap the application with the AuthProvider */}
      <Router>
          <Routes>
            {/* Define routes for login, register, and todo pages */}
            <Route path='/' element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/app" element={<TodoPic />} /> {/* Render TodoWrapper by default */}
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

