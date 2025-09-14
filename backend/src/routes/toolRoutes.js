import express from 'express'
import prisma from '../prismaClient.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

// GET alla verktyg
router.get('/', authMiddleware, async (req, res) => {
  const tools = await prisma.tool.findMany({
    include: { user: true }
  });
  res.json(tools);
});

// POST nytt verktyg
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body

  const tool = await prisma.tool.create({
    data: {
      name,
      description: "",
      userId: req.userId
    },
    include: { user: true }
  })

  res.status(201).json(tool)
})

// PUT uppdatera beskrivning
router.put('/:id', authMiddleware, async (req, res) => {
  const { description } = req.body
  const { id } = req.params

  const updatedTool = await prisma.tool.update({
    where: { id: parseInt(id) },
    data: { description },
    include: { user: true }
  })
  res.json(updatedTool)
})

// DELETE
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params
  await prisma.tool.delete({
    where: { id: parseInt(id) }
  })
  res.send({ message: "Tool deleted" })
})

export default router
