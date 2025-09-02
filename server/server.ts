import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import cors from "cors";

dotenv.config();

connectDB();
const PORT: string | number = process.env.PORT || 5000;

const app: Express = express();

app.use(express.json());
// Configure CORS to allow requests from the frontend origin
app.use(
  cors({
    origin: "*",
  })
);


app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);




app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});