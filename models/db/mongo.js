const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err);
    process.exit(1);
  }
}

connectDB();

module.exports = {
  getCollection: (collectionName) => db.collection(collectionName),
};
