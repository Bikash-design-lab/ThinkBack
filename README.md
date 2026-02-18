# [ThinkBack](https://think-back.vercel.app)

## 📌 AI-Powered Educational Helpdesk Platform

ThinkBack is an interactive full-stack application designed to streamline educational inquiries through AI-tutoring and smart ticket management. It leverages **AI's** for real-time, context-aware assistance.

[![Frontend](https://img.shields.io/badge/Frontend-React%2019-black)](Frontend/README-FRONTEND.md)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-orange)](Backend/README-BACKEND.md)

### ⚡ Key Features
- **🎫 Smart Tickets**: Manage inquiries with AI-generated summaries and status tracking.
- **🤖 Real-time AI Chat**: Live tutoring sessions powered by LLMs with SSE streaming.
- **✨ Premium Experience**: Monochromatic glassmorphic UI with global state persistence.
- **🔔 Interactive Feedback**: Global toast notification system and real-time streaming indicators.

---

## 🏗 Project Architecture

ThinkBack is split into two main components, each with its own detailed documentation:

- **[Frontend (React)](Frontend/README-FRONTEND.md)**: Modern UI built with React 19, Tailwind v4, and Global Context API.
- **[Backend (FastAPI)](Backend/README-BACKEND.md)**: High-performance Python API integrated with Google Gemini and MongoDB.

---

## 📂 Project Structure

```bash
ThinkBack/
├── Frontend/           # React 19 Application (UI, State, Hooks)
│   └── README-FRONTEND.md
├── Backend/            # FastAPI Server (API, AI Logic, DB)
│   └── README-BACKEND.md
└── LICENSE             # MIT License
```

---

## 🚀 Getting Started

To get the entire platform running locally:

### 1. Backend Setup
```bash
cd Backend
pip install -r requirements.txt
# Configure .env with GEMINI_API_KEY
fastapi dev app.py
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 📜 Principles
- **Performance**: Zero-lag navigation via global state persistence.
- **Type Safety**: Unified TypeScript interfaces across the frontend.
- **Scalability**: Decoupled service-oriented architecture.

---

MIT License - Copyright © 2026 Bikash Prasad Barnwal
