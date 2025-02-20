import express from "express";
import { register, login } from "../controllers/authController.js";  // Note the extension `.js`

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/dummy", (req, res) => {
    res.send("dummy");
});

export default router;  // Use ES6 export
