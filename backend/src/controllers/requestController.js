import * as requestModel from '../models/requestModel.js';

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

    const renterId = req.userId;

    const request = await requestModel.createRequest({
      renterId,
      toolId: parseInt(toolId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      price: price
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRequest(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const request = await requestModel.getRequestById(id);
  
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
  
      if (req.userId !== request.renterId && req.userId !== request.tool.user.id) {
        return res.status(403).json({ error: "Not allowed to view this request" });
      }
  
      res.json(request);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

export async function deleteRequest(req, res) {
    try {
      const { id } = req.params;
      await requestModel.deleteRequest(id);
      res.json({ message: "Request deleted" });
    } catch (err) {
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
  
  
