import { getDb } from "../config/db.js";

// Looks up the user whose login token matches the Bearer token.
export default async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please log in to continue" });

  try {
    const user = await getDb().collection("users").findOne({ token });
    if (!user) return res.status(401).json({ message: "Session expired. Please log in again" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
}
