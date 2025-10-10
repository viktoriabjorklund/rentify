import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.startsWith('Bearer ')
  ? authHeader.split(' ')[1]
  : authHeader;
  
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // 🧠 Lägg till dessa debug-loggar
    console.log("🧩 DEBUG LOG:");
    console.log("JWT_SECRET length:", process.env.JWT_SECRET.length);
    console.log("Node version:", process.version);
    console.log("Decoded JWT:", decoded);
  
    // Se till att userId blir numeriskt och inte NaN
    const id = decoded.userId || decoded.id;
    req.userId = Number(id);
    console.log("✅ req.userId set to:", req.userId);
  
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}
