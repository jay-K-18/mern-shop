import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb } from "../config/db.js";

const newToken = () => crypto.randomBytes(32).toString("hex");
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const users = getDb().collection("users");
    const cleanEmail = email.trim().toLowerCase();

    if (await users.findOne({ email: cleanEmail }))
      return res.status(409).json({ message: "This email is already registered" });

    const user = {
      name: name.trim(),
      email: cleanEmail,
      password: await bcrypt.hash(password, 10),
      token: newToken(),
      createdAt: new Date(),
    };
    const { insertedId } = await users.insertOne(user);

    res.status(201).json({ token: user.token, user: publicUser({ ...user, _id: insertedId }) });
  } catch (err) {
    res.status(500).json({ message: "Could not register. Try again", error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const users = getDb().collection("users");
    const user = await users.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Email or password is incorrect" });

    const token = newToken();
    await users.updateOne({ _id: user._id }, { $set: { token } });

    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not log in. Try again", error: err.message });
  }
};

// GET /api/auth/me
export const me = (req, res) => res.json({ user: publicUser(req.user) });
