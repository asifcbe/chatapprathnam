// =============================================================
//  Simple Chat API  —  a CRUD backend for learning
//
//  CRUD = Create, Read, Update, Delete
//
//    Create  ->  POST    /api/messages        (send a message)
//    Read    ->  GET     /api/messages        (get all messages)
//    Read    ->  GET     /api/messages/:id    (get one message)
//    Update  ->  PUT     /api/messages/:id    (edit a message)
//    Delete  ->  DELETE  /api/messages/:id    (delete a message)
// =============================================================

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware (runs before every route) ----------

// Allow browsers on OTHER websites (e.g. your page on Live Server, 127.0.0.1:5500)
// to call this API. Without this you get the famous "CORS error".
app.use(cors());

// Turn the JSON text in a request body into a JS object -> req.body
app.use(express.json());

// Serve the demo chat page from the /public folder
app.use(express.static("public"));

// Log every request so students can watch them arrive in the terminal
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, Object.keys(req.body || {}).length ? req.body : "");
  next();
});

// ---------- "Database" ----------
// Just an array in memory. It resets when the server restarts.
// (A real app would use MongoDB, PostgreSQL, Firebase, etc.)
let messages = [
  { id: 1, user: "Teacher", text: "Welcome to the class chat! 👋", createdAt: new Date().toISOString(), updatedAt: null },
];
let nextId = 2;

// ---------- Routes ----------

// Health check — open the URL in a browser to see the API is alive
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Chat API is running 🚀", total: messages.length });
});

// READ all  ->  GET /api/messages
// Optional: GET /api/messages?user=Asif  (filter with a query parameter)
app.get("/api/messages", (req, res) => {
  const { user } = req.query;
  const result = user
    ? messages.filter((m) => m.user.toLowerCase() === user.toLowerCase())
    : messages;
  res.status(200).json(result);
});

// READ one  ->  GET /api/messages/5
app.get("/api/messages/:id", (req, res) => {
  const id = Number(req.params.id);
  const message = messages.find((m) => m.id === id);

  if (!message) {
    return res.status(404).json({ error: `Message ${id} not found` });
  }
  res.status(200).json(message);
});

// CREATE  ->  POST /api/messages   body: { "user": "Asif", "text": "Hi" }
app.post("/api/messages", (req, res) => {
  const { user, text } = req.body || {};

  // Validation: never trust what the frontend sends
  if (!user || !text) {
    return res.status(400).json({ error: "Both 'user' and 'text' are required" });
  }

  const newMessage = {
    id: nextId++,
    user: String(user).trim().slice(0, 30),
    text: String(text).trim().slice(0, 500),
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  messages.push(newMessage);

  res.status(201).json(newMessage); // 201 = Created
});

// UPDATE  ->  PUT /api/messages/5   body: { "text": "Edited text" }
app.put("/api/messages/:id", (req, res) => {
  const id = Number(req.params.id);
  const message = messages.find((m) => m.id === id);

  if (!message) {
    return res.status(404).json({ error: `Message ${id} not found` });
  }

  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: "'text' is required" });
  }

  message.text = String(text).trim().slice(0, 500);
  message.updatedAt = new Date().toISOString();

  res.status(200).json(message);
});

// DELETE  ->  DELETE /api/messages/5
app.delete("/api/messages/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = messages.some((m) => m.id === id);

  if (!exists) {
    return res.status(404).json({ error: `Message ${id} not found` });
  }

  messages = messages.filter((m) => m.id !== id);
  res.status(204).send(); // 204 = No Content (deleted, nothing to send back)
});

// Anything else under /api -> 404
app.use("/api", (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} does not exist` });
});

app.listen(PORT, () => {
  console.log(`✅ Chat API running at http://localhost:${PORT}`);
});
