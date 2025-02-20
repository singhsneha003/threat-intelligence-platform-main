import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center text-white">
      <Link to="/" className="text-xl font-bold">Threat Intellignece Platform</Link>
      <div>
        {user ? (
          <button onClick={logout} className="px-4 py-2 bg-red-500 rounded">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="px-4">Login</Link>
            <Link to="/register" className="px-4">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
