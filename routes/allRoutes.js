const express = require("express");
const router = express.Router();

const { validateRequest } = require("../middlewares");

const RequestController = require("../controllers/RequestController");

const {
  addPartner,
  authenticatePartner,
  verifyToken,
} = require("../controllers/authController");
const { addUser, updateUser } = require("../controllers/userController");

router.post("/admin/addpartner", validateRequest, addPartner);
router.post("/authenticate", validateRequest, authenticatePartner);

router.post("/users", validateRequest, verifyToken, addUser); // Add user
router.put("/users/:user_id", validateRequest, verifyToken, updateUser); // Update user

router.post("/encrypt", validateRequest, RequestController.encrypt);
router.post("/decrypt", validateRequest, RequestController.decrypt);

module.exports = router;
