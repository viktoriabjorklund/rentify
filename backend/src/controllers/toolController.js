import * as toolModel from '../models/toolModel.js';
import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

function toNumberOrNull(v) {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function getTools(req, res) {
  try {
    const tools = await toolModel.getAllTools();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createTool(req, res) {
  try {
    const { name, description, price, location, category } = req.body;

    if (!req.file) return res.status(400).json({ error: "Photo is required" });

    const result = await uploadToCloudinary(req.file.buffer);
    const photoURL = result.secure_url;
    
    if (price === null || price === undefined || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    if (!location || location.trim() === "") {
      return res.status(400).json({ error: "Location is required" });
    }
    if (!name) return res.status(400).json({ error: "name is required" });

    const tool = await toolModel.createTool({
      name,
      description,
      price: Number(price),
      location,
      category,
      photoURL,
      userId: req.userId,
    });

    res.status(201).json(tool);
  } catch (err) {
    console.error("Error creating tool:", err);
    res.status(500).json({ error: "Failed to create tool" });
  }
}



export async function updateTool(req, res) {
  try {
    const toolId = Number(req.params.id);

    const existing = await toolModel.findToolOwner(toolId);

    if (!existing) return res.status(404).json({ error: "Tool not found" });
    if (existing.userId !== req.userId)
      return res.status(403).json({ error: "Forbidden" });

    const { name, description, price, location, category } = req.body;
    const photoURL = req.file ? req.file.path : undefined;
    // Build partial update object (only set provided fields)
    const data = {
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price: toNumberOrNull(price) } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(photoURL !== undefined ? { photoURL } : {}),
    };

    const updated = await toolModel.updateTool(toolId, data);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTool(req, res) {
  try {
    const toolId = Number(req.params.id);

    const existing = await toolModel.findToolOwner(toolId);

    if (!existing) return res.status(404).json({ error: "Tool not found" });
    if (existing.userId !== req.userId)
      return res.status(403).json({ error: "Forbidden" });

    await toolModel.deleteTool(toolId);
    res.json({ message: "Tool deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function displayTool(req, res) {
  try {
    const { id } = req.params;
    const tool = await toolModel.displayTool(id);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMyTools(req, res) {
  try {
    const tools = await toolModel.getToolsByUser(req.userId);
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
