import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ThreatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [threat, setThreat] = useState(null);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const fetchThreatDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/threats/${id}`);
      console.log(response.data.threat);

      setThreat(response.data.threat);
      setComments(response.data.comments);
      setVotes(response.data.threat.votes);
    } catch (error) {
      console.error("Error fetching threat details:", error);
    }
  };

  useEffect(() => {
    fetchThreatDetail();
  }, [id, refetch]);

  const handleVote = async (type) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/threats/${id}/vote`,
        { vote: type === "upvote" ? 1 : -1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success(type === "upvote" ? "Upvoted!" : "Downvoted!");
      setRefetch((p) => !p);
      fetchThreatDetail(); // Refetch data to update votes
    } catch (error) {
      toast.error("Error voting.");
      console.error("Error voting:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/threats/${id}/comment`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Comment added!");
      setCommentText(""); // Clear input field
      setRefetch((p) => !p);
      fetchThreatDetail(); // Refetch data to update comments
    } catch (error) {
      toast.error("Error adding comment.");
      console.error("Error adding comment:", error);
    }
  };

  const getDisplayValue = (value) => {
    return value ? value : "N/A";
  };

  if (!threat) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="mx-auto p-6 bg-gray-900 min-h-screen">
  <div className="grid grid-cols-3 gap-6">
    {/* Left Section - Threat Details in Cards */}
    <div className="col-span-2 space-y-6">
      {threats.map((threat) => (
        <div key={threat.id} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 relative">
          <h1 className="text-2xl font-bold text-white mb-3">
            {getDisplayValue(threat.threat_type).replace("_", " ")}
          </h1>
          <p className="text-gray-300"><strong>Description:</strong> {getDisplayValue(threat.description)}</p>
          <p className="text-gray-300"><strong>Category:</strong> {getDisplayValue(threat.category)}</p>
          <p className="text-gray-300"><strong>Severity:</strong> {getDisplayValue(threat.severity)}</p>
          <p className="text-gray-300"><strong>Status:</strong> {getDisplayValue(threat.status)}</p>
          <p className="text-gray-300"><strong>Reported At:</strong> {threat.created_at ? new Date(threat.created_at).toLocaleString() : "N/A"}</p>

          {/* Upvote & Downvote Section */}
          <div className="flex items-center gap-4 mt-4">
            <button onClick={() => handleVote(threat.id, "upvote")} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition">
              <FaThumbsUp /> Upvote
            </button>
            <span className="text-xl font-bold text-white">{threat.votes}</span>
            <button onClick={() => handleVote(threat.id, "downvote")} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition">
              <FaThumbsDown /> Downvote
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Right Section - Comments */}
    <div className="col-span-1 bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-lg font-bold text-white mb-3">Add a Comment</h2>
      <form onSubmit={handleAddComment} className="mb-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg shadow-md hover:bg-blue-600 transition">
          Submit Comment
        </button>
      </form>

      <h2 className="text-lg font-bold text-white">Comments</h2>
      <div className="max-h-80 overflow-y-auto">
        {comments.length > 0 ? (
          <ul className="mt-2">
            {comments.map((comment) => (
              <li key={comment.id} className="bg-gray-700 p-3 rounded-lg my-2 shadow-md">
                <p className="text-gray-300">{comment.comment}</p>
                <small className="text-gray-500">{new Date(comment.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No comments yet.</p>
        )}
      </div>
    </div>
  </div>

  {/* Login Popup */}
  {showLoginPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Login Required</h2>
        <p className="text-gray-300">You need to log in to vote or add a comment.</p>
        <div className="flex justify-end mt-4">
          <button onClick={() => setShowLoginPopup(false)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            Cancel
          </button>
          <button onClick={() => navigate("/login")} className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};


export default ThreatDetail;



