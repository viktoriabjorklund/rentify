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
