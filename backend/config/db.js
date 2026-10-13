import { MongoClient } from "mongodb";

let db;

export async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_shop");
    await client.connect();
    db = client.db(); // database name comes from MONGO_URI

    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ token: 1 });
    await db.collection("carts").createIndex({ userId: 1 }, { unique: true });

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

export const getDb = () => db;
