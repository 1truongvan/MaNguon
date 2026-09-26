import ProductVariant from "../models/ProductVariant.js";

export const getAllVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.find().populate("product_id");
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getVariantsByProduct = async (req, res) => {
  try {
    const variants = await ProductVariant.find({
      product_id: req.params.productId,
    });

    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getVariantById = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);

    if (!variant)
      return res.status(404).json({ error: "Variant not found" });

    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createVariant = async (req, res) => {
  try {
    const newVariant = await ProductVariant.create(req.body);
    res.status(201).json(newVariant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const updateVariant = async (req, res) => {
  try {
    const updatedVariant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedVariant)
      return res.status(404).json({ error: "Variant not found" });

    res.json(updatedVariant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const deletedVariant = await ProductVariant.findByIdAndDelete(
      req.params.id
    );

    if (!deletedVariant)
      return res.status(404).json({ error: "Variant not found" });
    res.json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
