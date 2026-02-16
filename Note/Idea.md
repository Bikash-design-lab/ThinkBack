AI Educational Helpdesk Platform (SSE Streaming)

🎯 Project Overview
Build a full-stack educational helpdesk app where users:
create educational tickets
browse tickets
chat with an AI tutor on a dedicated page
ask AI about specific tickets
receive AI responses via SSE streaming
Tickets act like:
👉 knowledge articles
👉 learning guides
👉 troubleshooting cases
The chatbot acts like:
👉 AI tutor that can reference tickets.

👤 User Role
Only one role: User
No authentication required.
Users can:
create tickets
view tickets
open chatbot page
chat with AI
ask AI about a ticket

🧱 Tech Stack
Frontend:
Vite
React
TypeScript
Backend:
Python
FastAPI
SSE streaming
Database:
MongoDB or PostgreSQL
AI:
Gemini API (streaming)

🧠 Core UX Layout
The chatbot is a separate page, not floating.
Layout:


Sidebar = list of tickets
Chat area = conversation

🧩 Feature Breakdown

✅ Feature 1 — Ticket System
Users create tickets.
Ticket fields:
id
title
description
category
tags[]
ai_summary
created_at
Pages:
Ticket list page
Create ticket page
Ticket detail page
Flow:
User creates ticket
→ backend generates AI summary
→ ticket saved
→ appears in list

✅ Feature 2 — Chat Page with Ticket Sidebar
Dedicated chat page:
/chat

Sidebar shows ticket list.
User can:
click a ticket → chat becomes ticket-aware
or chat globally with no ticket selected
If ticket selected:
Gemini receives ticket context.
If none selected:
Global AI tutor mode.

Example behavior
User selects ticket:
“Image upload error”
Then asks:
Why does this happen?
AI answers using ticket info.

✅ Feature 3 — SSE Streaming Chat
All AI responses must stream live.
Backend streams chunks via SSE.
Frontend appends text gradually.
Required behavior:
live typing effect
input disabled during stream
loading indicator

🔌 Backend API (SSE)

Get tickets
GET /tickets

Create ticket
POST /tickets

Global chat
POST /chat/global/stream

Ticket chat
POST /chat/ticket/{id}/stream



🗃 Database Schema
Ticket
id
title
description
category
tags[]
ai_summary
created_at

Chat saving: 👉 optional bonus (not mandatory)

🤖 Gemini Prompt Strategy
Global mode:
You are an educational AI tutor. Explain clearly and step-by-step.
Ticket mode:
Use this ticket as context and answer educationally.
Ticket data injected automatically.

🎨 Frontend Requirements
Pages:
/tickets → list
/tickets/new → create
/tickets/:id → detail
/chat → chatbot page
Chat page layout:
Sidebar (tickets)
Chat messages
Input box

UI expectations:
simple layout
responsive
loading states
error handling
No fancy animations required.


