import * as requestModel from '../models/requestModel.js';
import * as toolModel from '../models/toolModel.js'; // Lägg till om du inte har

export async function getSentRequests(req, res) {
  try {
    const requests = await requestModel.getAllSentRequests(req.userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRecievedRequests(req, res) {
  try {
    const requests = await requestModel.getAllRecievedRequests(req.userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createRequest(req, res) {
  try {
    const { toolId, startDate, endDate, price } = req.body;

    if (!toolId || !startDate || !endDate) {
      return res.status(400).json({ error: "toolId, startDate and endDate are required" });
    }

    const tool = await toolModel.displayTool(parseInt(toolId));
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    if (tool.user.id === req.userId) {
      return res.status(403).json({ error: "You cannot request your own tool" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (start >= end) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const request = await requestModel.createRequest({
      renterId: req.userId,
      toolId: parseInt(toolId),
      startDate: start,
      endDate: end,
      price: price ?? tool.price,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function getRequest(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const request = await requestModel.getRequestById(id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (req.userId !== request.renter.id && req.userId !== request.tool.user.id) {
      return res.status(403).json({ error: "Not allowed to view this request" });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteRequest(req, res) {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const request = await requestModel.getRequestById(id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (req.userId !== request.renter.id) {
      return res.status(403).json({ error: "Forbidden: not your request" });
    }

    await requestModel.deleteRequest(id);

    res.json({ message: "Request deleted" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateRequest(req, res) {
  try {
    const { id } = req.params;
    const { pending, accepted } = req.body;

    if (typeof pending !== "boolean" || typeof accepted !== "boolean") {
      return res.status(400).json({ error: "pending and accepted must be boolean values" });
    }

    const updated = await requestModel.updateRequest(id, { pending, accepted });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function markRequestAsViewed(req, res) {
  const { id } = req.params;

  try {
    const updated = await requestModel.updateRequestViewStatus(id, true);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

