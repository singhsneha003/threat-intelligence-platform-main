import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert spaces in username to _
    if (name === "username") {
      setFormData({ ...formData, [name]: value.replace(/\s+/g, "_") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.username) {
      setError("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
    //   alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-gray-800 relative overflow-hidden">
  {/* Background Pattern */}
  <div className="absolute inset-0 bg-[url('/images/abstract-pattern.svg')] opacity-20 mix-blend-overlay"></div>

  <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-96 border border-white/30 relative">
    <h2 className="text-4xl font-extrabold mb-6 text-center text-white drop-shadow-lg">
      Create an Account
    </h2>

    {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white shadow-md"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white shadow-md"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white shadow-md"
      />

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Sign Up
      </button>
    </form>

    <p className="text-center text-sm text-gray-300 mt-6">
      Already have an account?{" "}
      <a href="/login" className="text-blue-400 hover:underline hover:text-blue-300">
        Login
      </a>
    </p>
  </div>
</div>


  );
};

export default Signup;
