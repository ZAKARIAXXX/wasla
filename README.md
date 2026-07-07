# Wasla (وصلة) — WhatsApp CRM & AI Assistant

Wasla is a SaaS CRM designed for WhatsApp-based businesses. It helps teams manage conversations, track leads, automate follow-ups, and improve customer response efficiency.

It includes **Karima AI**, an AI assistant module that supports Moroccan Darija and French for automated customer interaction and lead qualification (simulated using integrated custom NLP heuristics and OpenAI API patterns).

---

## 🔗 Live Demo

*   **URL:** [https://wasla-demo.example.com](https://wasla-demo.example.com) *(Insert your deployed demo link here)*
*   **Demo Credentials:** Available on the login page for public testing.

---

##  Key Features

*   ** Centralized Chat Inbox:** Real-time customer communication interface powered by WebSockets.
*   ** Karima AI:** Multilingual assistant for lead qualification and automated responses in Moroccan Darija and French.
*   ** Kanban Lead Pipeline:** Visual drag-and-drop workflow tracking lead stages.
*   ** Automated Campaigns:** Scheduled follow-ups and broadcast messaging templates using background workers.
*   ** Performance Analytics:** Key metrics covering response times, conversation volumes, and conversion rates.
*   ** Team Collaboration:** Role-based access controls (Owner, Admin, Agent) for shared inbox management.
*   ** Localization:** Multi-language interface supporting English, French, and Darija/Arabic.

---

##  Tech Stack

### Frontend
React, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Query, Framer Motion, Recharts, Socket.io-client, i18next

### Backend
Node.js, Express, TypeScript, Prisma ORM, SQLite/PostgreSQL, Socket.io, JWT, Bcrypt, Node-cron

---

##  Architecture

```
Frontend (React)
  └── API Layer (REST + WebSockets)
        └── Backend (Node.js + Express)
              ├── Database (SQLite/PostgreSQL via Prisma)
              └── AI Agent Module (Karima AI handler)
```

---

##  Setup

### Clone and Install
```bash
git clone https://github.com/yourusername/waslasaas.git
cd waslasaas
npm install
```

### Backend Configuration
```bash
cd backend/node-api
npm install
```

Create a `.env` file inside `backend/node-api` using the following variables:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"
```

Initialize database schema and run seed data:
```bash
npx prisma migrate dev --name init
npm run seed
```

### Run Project
From the project root:
```bash
npm run dev
```

---

##  What I Built & Key Challenges

*   **Real-time synchronization:** Designed and implemented a bi-directional messaging pipeline using WebSockets (Socket.io) to ensure multiple agents see instant chat updates simultaneously.
*   **Drag-and-drop state management:** Built a lightweight, reactive Kanban board for deal tracking with persistence directly to the relational database schema.
*   **Multilingual assistant module:** Programmed a modular handler to parse French and Moroccan Darija dialect nuances, routing qualified leads to different pipelines automatically.
*   **Scalable scheduler:** Designed cron-based drip messaging sequences that evaluate tag states dynamically before triggering.

---

##  Security & Hygiene

*   All sensitive environment keys are managed via `.env` files.
*   `.env` files and SQLite database binaries (`*.db`) are strictly excluded from version control via `.gitignore`.
*   Authentication is handled using stateless JWTs and password hashing with Bcrypt.

---

##  License

MIT
