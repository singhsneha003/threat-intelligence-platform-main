import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider, useAuth, AuthContext } from "./context/AuthContext"; // ✅ FIXED IMPORT
import Signup from "./pages/Signup";
import ThreatDetail from "./pages/ThreatDetail";
import { Toaster } from "react-hot-toast";
import AddThreat from "./pages/AddThreat";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster/>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/threat/:id" element={<ThreatDetail />} />
          <Route path="/add-threat" element={<AddThreat />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Threat Report</h1>
      {user ? (
        <button onClick={logout} className="px-4 py-2 bg-red-500 rounded">
          Logout
        </button>
      ) : (
        <a href="/login" className="text-blue-400">Login</a>
      )}
    </nav>
  );
};

export default App;
