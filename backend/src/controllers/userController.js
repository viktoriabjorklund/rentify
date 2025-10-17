import * as userModel from '../models/userModel.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function register(req, res) {
    const { username, password, name, surname } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 5) {
        return res.status(400).json({ error: "Password must be at least 5 characters long" });
      }
  
    try {
      const existing = await userModel.getUserByUsername(username);
      if (existing) return res.status(400).json({ error: "Username already taken" });
  
      const hashed = bcrypt.hashSync(password, 10);
      const newUser = await userModel.createUser(username, hashed, name, surname);
  
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

export async function login(req, res) {
    const { username, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) { return res.status(401).send({ message: "User not found" }) }

        
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        
// jag la till användardata i login-responsen så att vi har det ifall vi vill visa användarnamn eller andra detaljer i framtiden, typ när de loggar in (välkommen tillbaka XX)
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.json({ 
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                surname: user.surname
            }
        })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
}

export async function updateUser(req, res) {
  try {
    const { name, surname, password } = req.body;
    const { id } = req.params;
    const updated = await userModel.updateUser(id, name, surname, password);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function displayUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.displayUser(id);

    if (!user) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
