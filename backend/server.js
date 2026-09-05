const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI;

const Item = mongoose.model(
  "Item",
  new mongoose.Schema(
    { name: { type: String, required: true } },
    { timestamps: true }
  )
);

app.get("/health", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    status: ready ? "UP" : "DOWN",
    database: ready ? "CONNECTED" : "DISCONNECTED"
  });
});

app.get("/api/items", async (req, res) => {
  res.json(await Item.find().sort({ createdAt: -1 }));
});

app.post("/api/items", async (req, res) => {
  const item = await Item.create({ name: req.body.name });
  res.status(201).json(item);
});

let server;

async function start() {
  await mongoose.connect(MONGO_URI);
  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production API running on ${PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received`);
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch(err => {
  console.error(err);
  process.exit(1);
});
