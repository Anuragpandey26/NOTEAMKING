import express, { Request, Response } from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

interface NoteRequestBody {
  title: string;
  description: string;
}

interface NoteResponse {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Get notes
router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ createdBy: (req as any).user._id });
    res.json(notes);
  } catch (err) {
    console.error("Get all notes error: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a note
router.post(
  "/",
  protect,
  async (req: Request<{}, {}, NoteRequestBody>, res: Response) => {
    const { title, description } = req.body;
    try {
      if (!title || !description) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }
      const note = await Note.create({
        title,
        description,
        createdBy: (req as any).user._id,
      });
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get a note
router.get("/:id", protect, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put(
  "/:id",
  protect,
  async (req: Request<{ id: string }, {}, NoteRequestBody>, res: Response) => {
    const { title, description } = req.body;
    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (note.createdBy.toString() !== (req as any).user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      note.title = title || note.title;
      note.description = description || note.description;

      const updatedNote = await note.save();
      res.json(updatedNote);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a note
router.delete(
  "/:id",
  protect,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (note.createdBy.toString() !== (req as any).user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      await note.deleteOne();
      res.json({ message: "Note was deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;