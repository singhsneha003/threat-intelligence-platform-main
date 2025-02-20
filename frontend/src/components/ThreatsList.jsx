import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";

const ThreatsList = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await axiosInstance.get("/threats?sortBy=latest");
        setThreats(response.data);
      } catch (err) {
        setError("Error fetching threats");
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Threat Reports</h2>
      <ul className="space-y-2">
        {threats.map((threat) => (
          <Link to={`/threat/${threat.id}`}  key={threat.id || "N/A"}>
          <li key={threat.id} className="p-4 border rounded-md shadow-md mb-2">
            <p><strong>Posted By:</strong> {threat.username || "N/A"}</p>
            <p><strong>Type:</strong> {threat.threat_type || "N/A"}</p>
            <p><strong>Description:</strong> {threat.description || "N/A"}</p>
          </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ThreatsList;
