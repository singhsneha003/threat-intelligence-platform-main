import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        login({ email, token: response.data.token }); // Update context
        navigate("/"); // Redirect to Home
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-gray-700 relative">
  {/* Background Pattern */}
  <div className="absolute inset-0 bg-[url('/images/security-pattern.png')] opacity-10"></div>

  <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 border border-white/20 relative">
    <h2 className="text-3xl font-extrabold mb-6 text-center text-white">
      Secure Login
    </h2>
    
    {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-white text-sm mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-white text-sm mb-2">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition duration-300"
      >
        Login
      </button>
    </form>

    <p className="text-center text-sm text-gray-300 mt-4">
      Don't have an account?{" "}
      <Link to="/signup" className="text-blue-400 hover:underline">
        Sign Up
      </Link>
    </p>
  </div>
</div>

  );
};

export default Login;
