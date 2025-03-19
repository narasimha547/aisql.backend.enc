const helmet = require("helmet");
const xss = require("xss-clean");
const { body, validationResult } = require("express-validator");
const express = require("express");

const logger = require("../utils/logger");
const { encryptData, decryptData } = require("../utils/cryptoUtil");

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());
app.use(express.json());

exports.encrypt = (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ error: "Request denied due to policy violations." });
    }
    // Encrypt Data
    const encryptedData = encryptData(data);
    logger.info(
      `Decrypted Data: ${JSON.stringify(
        data
      )} --> Encrypted Data: ${encryptedData} `
    );

    res.json({ data: encryptedData });
  } catch (error) {
    logger.info(`Encryption Error:", ${error}`);
    res.status(500).json({ error: "Encryption failed" });
  }
};

exports.decrypt = (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "No encrypted data provided" });
  }
  try {
    const decryptedData = decryptData(data);
    logger.info(
      `Decrypted Data:", ${data} --> Encrypted Data:", ${JSON.stringify(
        decryptedData
      )} `
    );
    res.json({ data: decryptedData });
  } catch (error) {
    res.status(500).json({ error: "Decryption failed" });
  }
};
