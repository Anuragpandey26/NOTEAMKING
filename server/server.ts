import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import cors from "cors";
import path from "path";
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

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});