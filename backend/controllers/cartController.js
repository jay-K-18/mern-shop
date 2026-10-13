import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";

// Cart document: { userId, items: [{ productId, quantity }] }
const carts = () => getDb().collection("carts");
const products = () => getDb().collection("products");

// Returns { items: [{ product, quantity }] } with full product details
async function loadCart(userId) {
  const cart = await carts().findOne({ userId });
  const items = cart?.items || [];
  if (items.length === 0) return { items: [] };

  const found = await products().find({ _id: { $in: items.map((i) => i.productId) } }).toArray();
  const byId = new Map(found.map((p) => [p._id.toString(), p]));

  return {
    items: items
      .map((i) => ({ product: byId.get(i.productId.toString()), quantity: i.quantity }))
      .filter((i) => i.product),
  };
}

const saveItems = (userId, items) =>
  carts().updateOne({ userId }, { $set: { items } }, { upsert: true });

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    res.json(await loadCart(req.user._id));
  } catch (err) {
    res.status(500).json({ message: "Could not load cart", error: err.message });
  }
};

// POST /api/cart   body: { productId, quantity? }
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!ObjectId.isValid(productId))
      return res.status(400).json({ message: "Invalid product" });

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const product = await products().findOne({ _id: new ObjectId(productId) });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await carts().findOne({ userId: req.user._id });
    const items = cart?.items || [];
    const existing = items.find((i) => i.productId.toString() === productId);
    const newQty = (existing ? existing.quantity : 0) + qty;

    if (newQty > product.stock)
      return res.status(400).json({ message: `Only ${product.stock} left in stock` });

    if (existing) existing.quantity = newQty;
    else items.push({ productId: product._id, quantity: qty });

    await saveItems(req.user._id, items);
    res.status(201).json(await loadCart(req.user._id));
  } catch (err) {
    res.status(500).json({ message: "Could not add to cart", error: err.message });
  }
};

// PUT /api/cart/:productId   body: { quantity }
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const qty = parseInt(req.body.quantity, 10);
    if (!ObjectId.isValid(productId)) return res.status(400).json({ message: "Invalid product" });
    if (!qty || qty < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const product = await products().findOne({ _id: new ObjectId(productId) });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (qty > product.stock)
      return res.status(400).json({ message: `Only ${product.stock} left in stock` });

    const cart = await carts().findOne({ userId: req.user._id });
    const item = cart?.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item is not in your cart" });

    item.quantity = qty;
    await saveItems(req.user._id, cart.items);
    res.json(await loadCart(req.user._id));
  } catch (err) {
    res.status(500).json({ message: "Could not update cart", error: err.message });
  }
};

// DELETE /api/cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const cart = await carts().findOne({ userId: req.user._id });
    if (cart) {
      const items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
      await saveItems(req.user._id, items);
    }
    res.json(await loadCart(req.user._id));
  } catch (err) {
    res.status(500).json({ message: "Could not remove item", error: err.message });
  }
};
