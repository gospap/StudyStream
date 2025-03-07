// src/pages/Auth.jsx
import { useState } from "react";
import axios from "axios";
import "./Auth.css";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://api.example.com/login", {
        email,
        password,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Auth;
