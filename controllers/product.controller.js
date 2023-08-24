const Product = require("../database/models/product.model");

// get all existing products
const getProducts = async (req, res) => {
  const products = await Product.find({});

  if (products.length === 0) {
    console.log(`No products existed !`);
    return res.status(404).json({ error: `No products existed !` });
  }

  console.log(`List of products : ${products}`);
  return res.status(200).json({ response: products });
};

// get one existing product
const getProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ productId: id });

  if (!product) {
    console.log(`Product ${id} does not exist !`);
    return res.status(404).json({ error: `Product ${id} does not exist !` });
  }

  console.log(`Product ${id} :`, product);
  return res.status(200).json({ product });
};

// create one product if it does not exist
const createProduct = async (req, res) => {
  const body = req.body;
  const length = Object.keys(body).length;

  if (!body || length !== 9) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const product = new Product({
    name: body.name,
    price: body.price,
    stock: body.stock,
    dimension: body.dimension,
    color: body.color,
    description: body.description,
    rate: body.rate,
    image: body.image,
    state: body.state,
  });

  await product
    .save()
    .then(async () => {
      console.log(`New product has been successfully created !`);

      return res
        .status(201)
        .json({ response: `Your product has been successfully created !` });
    })
    .catch((err) => {
      if (err) {
        console.log(`Error product creation :`, err);
        return res.status(500).json({ error: err });
      }
    });
};

// update one product if it exists
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const length = Object.keys(body).length;

  if (!body || length !== 9) {
    return res.status(400).json({ error: `Please fill in all fields !` });
  }

  const isProductExist = await Product.findOneAndUpdate(
    { productId: id },
    {
      name: body.name,
      price: body.price,
      stock: body.stock,
      dimension: body.dimension,
      color: body.color,
      description: body.description,
      rate: body.rate,
      image: body.image,
      state: body.state,
    }
  );

  if (!isProductExist) {
    console.log(`Product ${id} does not exist !`);
    return res.status(404).json({ error: `Product ${id} does not exist !` });
  }

  console.log(`Product ${id} has been successfully updated !`);

  return res
    .status(200)
    .json({ response: `Product ${id} has been successfully updated !` });
};

// delete one product if it exists
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const isProductExist = await Product.exists({ productId: id });

  if (!isProductExist) {
    console.log(`Product ${id} does not exist !`);
    return res.status(404).json({ error: `Product ${id} does not exist !` });
  }

  const product = await Product.deleteOne({ productId: id });

  console.log(`Product ${id} has been successfully deleted !`);
  return res
    .status(202)
    .json({ response: `Product ${id} has been successfully deleted !` });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
