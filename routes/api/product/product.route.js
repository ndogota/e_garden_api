const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../../controllers/product.controller");

const { authAuthorization } = require("../../../middlewares/auth.middleware");
const { adminAuthorization } = require("../../../middlewares/admin.middleware");

router.get(`/`, getProducts);

router.get(`/:id`, getProduct);

router.post(`/`, authAuthorization, adminAuthorization, createProduct);

router.put(`/:id`, authAuthorization, adminAuthorization, updateProduct);

router.delete(`/:id`, authAuthorization, adminAuthorization, deleteProduct);

module.exports = router;
