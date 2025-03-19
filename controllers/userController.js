const bcrypt = require("bcrypt");
const db = require("../models/db"); // This automatically selects the correct DB
const { encryptData, decryptData } = require("../utils/cryptoUtil");

// 🔹 Add User
const addUser = async (req, res) => {
  const {
    company_id,
    firstName,
    lastName,
    email,
    vcPhone,
    password,
    created_by,
    vcProfileImg,
    isAdmin,
    isActive,
  } = decryptData(req.body.data);

  if (
    !company_id ||
    !firstName ||
    !lastName ||
    !email ||
    !vcPhone ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided." });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (company_id, firstName, lastName, email, vcPhone, password_hash, created_by, vcProfileImg, isAdmin, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      company_id,
      firstName,
      lastName,
      email,
      vcPhone,
      hashedPassword,
      created_by || null,
      vcProfileImg || null,
      isAdmin || false,
      isActive || true,
    ];

    await db.query(query, values);

    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists." });
    }
    res
      .status(500)
      .json({ error: "Failed to add user", details: error.message });
  }
};

// 🔹 Update User
const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const {
    firstName,
    lastName,
    email,
    vcPhone,
    password,
    modified_by,
    vcProfileImg,
    isAdmin,
    isActive,
  } = decryptData(req.body.data);

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    let query = "UPDATE users SET modified_at = CURRENT_TIMESTAMP, ";
    const values = [];

    if (firstName) {
      query += "firstName = ?, ";
      values.push(firstName);
    }
    if (lastName) {
      query += "lastName = ?, ";
      values.push(lastName);
    }
    if (email) {
      query += "email = ?, ";
      values.push(email);
    }
    if (vcPhone) {
      query += "vcPhone = ?, ";
      values.push(vcPhone);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += "password_hash = ?, ";
      values.push(hashedPassword);
    }
    if (modified_by) {
      query += "modified_by = ?, ";
      values.push(modified_by);
    }
    if (vcProfileImg) {
      query += "vcProfileImg = ?, ";
      values.push(vcProfileImg);
    }
    if (isAdmin !== undefined) {
      query += "isAdmin = ?, ";
      values.push(isAdmin);
    }
    if (isActive !== undefined) {
      query += "isActive = ?, ";
      values.push(isActive);
    }

    query = query.slice(0, -2) + " WHERE user_id = ?";
    values.push(user_id);

    const result = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "User not found or no changes made." });
    }

    res.json({ message: "User updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
};

module.exports = { addUser, updateUser };
