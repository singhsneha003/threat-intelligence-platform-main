import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreatsList from "../components/ThreatsList";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Simulated authentication check
  const isLoggedIn = !!localStorage.getItem("token"); // Adjust based on your auth system

  const handleAddThreat = () => {
    console.log(!!localStorage.getItem("token"));
    
    if (user) {
      navigate("/add-threat");
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 flex flex-col items-center">
    <h1 className="text-5xl font-extrabold mb-8 text-gray-900 drop-shadow-lg">
      WELCOME TO THREAT INTELLIGENCE SHARING PLATFORM 
    </h1>
  
    {/* Add Threat Button */}
    <button
      onClick={handleAddThreat}
      className="mb-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-700 text-white font-semibold rounded-xl shadow-xl hover:from-purple-600 hover:to-blue-800 transition-all transform hover:scale-105"
    >
      Submit a Threat
    </button>
  
    <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl p-10 border border-gray-400">
      <ThreatsList />
    </div>
  
    {/* Popup for not logged-in users */}
    {showPopup && (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-md">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center border border-white/20 relative">
        <h2 className="text-3xl font-extrabold mb-6 text-white drop-shadow-lg">
          You need to be logged-in
        </h2>
    
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:bg-blue-700 hover:scale-110 active:scale-95"
        >
          Login
        </button>
    
        <button
          onClick={() => setShowPopup(false)}
          className="ml-5 px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:bg-gray-800 hover:scale-110 active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
    )}
  </div>

  );
};

export default Home;
