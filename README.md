# Class Chat API

A tiny CRUD backend for a chat app, built with Node.js + Express. Made for teaching frontend developers how APIs work.

## Run locally

```bash
npm install
npm start          # or: npm run dev  (auto-restarts on save)
```

- Chat page: http://localhost:3000
- API check: http://localhost:3000/api

## Endpoints

| CRUD   | Method | URL                  | Body                           | Success |
|--------|--------|----------------------|--------------------------------|---------|
| Read   | GET    | `/api/messages`      | –                              | 200     |
| Read   | GET    | `/api/messages/:id`  | –                              | 200     |
| Create | POST   | `/api/messages`      | `{ "user": "...", "text": "..." }` | 201 |
| Update | PUT    | `/api/messages/:id`  | `{ "text": "..." }`            | 200     |
| Delete | DELETE | `/api/messages/:id`  | –                              | 204     |

Errors: `400` (missing fields), `404` (no message with that id).

Filter by user: `GET /api/messages?user=Asif`

## Try it from the browser console

```js
const API = "http://localhost:3000/api/messages";

await (await fetch(API)).json();                                    // Read

await fetch(API, {                                                  // Create
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user: "Me", text: "Hi from the console" }),
});

await fetch(`${API}/2`, {                                           // Update
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Edited!" }),
});

await fetch(`${API}/2`, { method: "DELETE" });                     // Delete
```

## Deploy to Render (free)

1. Push this folder to a GitHub repo.
2. Go to https://render.com → **New → Web Service** → pick the repo.
3. Settings:
   - Runtime: **Node**
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance type: **Free**
4. Click **Create Web Service**. After ~2 minutes you get a URL like `https://class-chat-xyz.onrender.com`.
5. Share that URL with the class — everyone chats in the same room.

Notes:
- Render free services sleep after ~15 min idle; the first request then takes ~30–50 s to wake up. Open the URL a few minutes before class.
- Messages are stored in memory, so they reset whenever the server restarts or redeploys. That's intentional for the class — a real app would use a database.

Alternatives with the same settings: Railway, Fly.io, Cyclic, Koyeb.

## Using it from your own HTML/CSS/JS page

CORS is enabled, so a page opened with VS Code Live Server (`127.0.0.1:5500`) can call the deployed API directly. The code-along version of the frontend is in `../student-chat/` (`index.html`, `style.css`, `app.js`). Set `API_URL` at the top of `app.js` to your Render URL:

```js
const API_URL = "https://class-chat-xyz.onrender.com";
const res = await fetch(API_URL + "/api/messages");
const messages = await res.json();
```
