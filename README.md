# The Rounds — Field Visit Tracker

A mobile-first field worklist plus a manager dashboard, matching the architecture in the
original project report: **React + Tailwind** frontend, **Node/Express** API, **MongoDB**
storage.

```
field-visit-tracker/
├── backend/     Express API + MongoDB models
└── frontend/    Vite + React client (Field view + Ledger dashboard)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB connection string (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
  works fine, or a local `mongod`)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI
npm run dev            # starts on http://localhost:4000
```

Endpoints:

| Method | Path                    | Purpose                                   |
| ------ | ----------------------- | ------------------------------------------|
| GET    | `/api/people`           | Full ledger (manager dashboard)           |
| GET    | `/api/people/pending`   | Not-yet-visited worklist (field client)   |
| POST   | `/api/people`           | Register a new person                     |
| DELETE | `/api/people/:id`       | Remove a person                            |
| POST   | `/api/visits`           | Log a visit `{ personId, visitedBy, notes }` |
| GET    | `/api/analytics/summary`| Completion rate overall, by neighborhood, and by age cohort |

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if your API isn't on localhost:4000
npm run dev            # starts on http://localhost:5173
```

Open the URL Vite prints. Use the **Field** tab on a phone for the visit queue, and the
**Ledger** tab on desktop for the roster and coverage analytics.

## 4. Deployment

- **Backend:** push `backend/` to its own GitHub repo (or a subfolder) and connect it to
  Render or AWS Elastic Beanstalk. Set `MONGO_URI`, `PORT`, and `CORS_ORIGIN` (your deployed
  frontend URL) as environment variables there.
- **Frontend:** run `npm run build` in `frontend/` and deploy the `dist/` folder to Vercel
  or Netlify. Set `VITE_API_URL` to your deployed backend URL as a build-time environment
  variable.
- **CI/CD:** connecting each repo/folder to Render and Vercel/Netlify's GitHub integration
  gives you automatic deploys on every push to `main`, matching the pipeline described in
  the report.

## 5. Notes on the data model

Each person record stores demographic fields (name, age, phone, address, neighborhood),
a visited flag, and an embedded `visitLogs` array so every touchpoint (who visited, when,
and what they noted) stays with the record. The `{ isVisited: 1, name: 1 }` index keeps the
pending-queue query fast as the roster grows.

The analytics endpoint groups people by neighborhood and by three age cohorts (17–20,
21–25, 26–30) and flags any group whose completion rate falls 20 points or more below the
overall average, so a manager can see at a glance where visits are falling behind.
