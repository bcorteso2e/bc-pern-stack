import prisma from "../db/prisma.js";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Products =>", products);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image, description, category } = req.body;

  if (!name || !price || !image || !description || !category) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        image,
        description,
        category
      },
    });
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log("Error createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        image,
      },
    });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.log("Error updateProduct function", error);
    if (error.code === "P2025") {
      // Prisma error: record not found
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.log("Error deleteProduct function", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
