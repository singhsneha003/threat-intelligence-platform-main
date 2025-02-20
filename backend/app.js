import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";  // Ensure you add `.js` extension
import threatRoutes from "./routes/threatRoutes.js";  // Ensure you add `.js` extension


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/threats', threatRoutes);

export default app;  // Use ES6 export
