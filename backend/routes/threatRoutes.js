import express from 'express';
import { 
    reportThreat, 
    getThreats, 
    voteThreat, 
    commentOnThreat, 
    getThreatComments, 
    getThreatById
} from '../controllers/threatController.js';

const router = express.Router();

// 📌 Report a threat
router.post('/report', reportThreat);

// 📌 Get all threats (supports sorting)
router.get('/', getThreats);

router.get("/:id", getThreatById);

// 📌 Upvote/Downvote a threat
router.post('/:id/vote', voteThreat);

// 📌 Add a comment to a threat
router.post('/:id/comment', commentOnThreat);

// 📌 Get comments for a specific threat
router.get('/:id/comments', getThreatComments);

export default router;
