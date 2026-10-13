import "dotenv/config";
import { MongoClient } from "mongodb";

const img = (seed) => `https://picsum.photos/seed/${seed}/600/450`;

const products = [
  { name: "Cotton kurta", description: "Breathable everyday kurta in soft handloom cotton.", price: 899, category: "Clothing", image: img("kurta"), stock: 25 },
  { name: "Canvas tote bag", description: "Heavy canvas tote with an inner zip pocket.", price: 449, category: "Accessories", image: img("tote"), stock: 40 },
  { name: "Steel water bottle", description: "750 ml insulated bottle, keeps drinks cold for 18 hours.", price: 699, category: "Home", image: img("bottle"), stock: 60 },
  { name: "Wireless earbuds", description: "Bluetooth 5.3, 24-hour battery with case.", price: 1999, category: "Electronics", image: img("earbuds"), stock: 15 },
  { name: "Ceramic coffee mug", description: "Hand-glazed 300 ml mug, dishwasher safe.", price: 349, category: "Home", image: img("mug"), stock: 50 },
  { name: "Running shoes", description: "Lightweight mesh trainers with cushioned sole.", price: 2499, category: "Clothing", image: img("shoes"), stock: 18 },
  { name: "Desk lamp", description: "Dimmable LED lamp with three colour temperatures.", price: 1299, category: "Electronics", image: img("lamp"), stock: 12 },
  { name: "Leather wallet", description: "Slim bifold wallet with six card slots.", price: 799, category: "Accessories", image: img("wallet"), stock: 30 },
];

const client = new MongoClient(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_shop");
await client.connect();
const col = client.db().collection("products");
await col.deleteMany({});
await col.insertMany(products);
console.log(`Seeded ${products.length} products`);
await client.close();
