import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddThreat = () => {
  const [formData, setFormData] = useState({
    threat_type: "",
    description: "",
    url: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to report a threat.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/threats/report",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Threat reported successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Report a Threat</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="threat_type">Threat Type</label>
          <select
            id="threat_type"
            name="threat_type"
            value={formData.threat_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Threat Type</option>
            <option value="spam">Spam</option>
            <option value="phishing">Phishing</option>
            <option value="security_risk">Security Risk</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Provide a detailed description of the threat"
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="url">URL (Optional)</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="http://example.com"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-5 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Submit Threat
        </button>
      </form>
    </div>
  );
};

export default AddThreat;
