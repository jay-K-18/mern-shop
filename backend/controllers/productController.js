import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/products?search=&category=
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };
    if (category && category !== "All") filter.category = category;

    const products = await getDb().collection("products").find(filter).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Could not load products", error: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: "Product not found" });

    const product = await getDb()
      .collection("products")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Could not load product", error: err.message });
  }
};
