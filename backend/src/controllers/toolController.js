import * as toolModel from '../models/toolModel.js';

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
    const { name, description = "", price, location } = req.body;

    if (price === null || price === undefined || isNaN(price) || price <= 0) { // Added validation for price and location
      return res.status(400).json({ error: "Invalid price" });
    }
    if (location === null || location === undefined || location.trim() === "") {
      return res.status(400).json({ error: "Location is required" });
    }
    const tool = await toolModel.createTool({name, description, price, location, userId: req.userId});
    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTool(req, res) {
  try {
    const { description } = req.body;
    const { id } = req.params;
    const updated = await toolModel.updateTool(id, description);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteTool(req, res) {
  try {
    const { id } = req.params;
    await toolModel.deleteTool(id);
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
