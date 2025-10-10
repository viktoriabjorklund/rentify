import * as userModel from '../models/userModel.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function register(req, res) {
    const { username, password, name, surname } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });
  
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

        if (!user) { return res.status(404).send({ message: "User not found" }) }

        
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        
// jag la till användardata i login-responsen så att vi har det ifall vi vill visa användarnamn eller andra detaljer i framtiden, typ när de loggar in (välkommen tillbaka XX)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
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

