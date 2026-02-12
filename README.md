# ThinkBack

## 📌 AI Educational Helpdesk Platform with Real-Time SSE Streaming

An interactive full-stack application where users create educational tickets, chat with AI, and receive intelligent responses via real-time Server-Sent Events (SSE) streaming.

### Key Features
- 🎫 **Ticket Management** - Create and view educational tickets with categorization and tagging
- 🤖 **AI Integration** - Powered by Google Gemini API with real-time streaming responses
- 💬 **Live Chat** - Interactive chat interface with streaming AI responses
- 📊 **Smart Filtering** - Filter tickets by category and tags with MongoDB indexing
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- ⚡ **High Performance** - Async Python backend with optimized MongoDB queries

---

## 🏗 Tech Stack

| Layer | Technologies |
|-------|---|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS + Zustand |
| **Backend** | Python 3.x + FastAPI + Async/Await |
| **Database** | MongoDB Atlas with strategic indexing |
| **AI** | Google Gemini API (Streaming mode) |
| **Deployment** | Vercel (Frontend & Backend) + MongoDB Atlas |

---

## 📂 Project Structure

```
ThinkBack/
├── Backend/
│   └── app.py                    # FastAPI main application
├── Frontend/                     # React + Vite application
└── README.md
```

---

## 🚀 Quick Start

### Backend Setup
```bash
cd Backend
pip install fastapi python-dotenv pymongo google-generativeai
python app.py
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 🔄 Architecture Flow

```
User (React Frontend)
    ↓ HTTPS
FastAPI Backend (Async)
    ↓
MongoDB Atlas
    ↓
Google Gemini API (Stream)
    ↓
SSE Response Stream
    ↓
Real-time UI Update
```

---

## 🎯 Core Capabilities

### 1. Ticket Management
- Create tickets with title, description, category, and tags
- View all tickets with real-time filtering
- Auto-generated AI summaries per ticket

### 2. AI Chat Interface
- Global chat mode for general queries
- Ticket-specific chat for contextual questions
- Real-time streaming responses via SSE

### 3. Database Strategy
- **Indexes**: `created_at`, `category`, `tags`, and compound indexes
- **Collections**: Single `tickets` collection with flexible schema
- **Performance**: Optimized for filtering, sorting, and pagination

---

## 📊 Data Schema

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "category": "String",
  "tags": ["Array", "of", "Strings"],
  "ai_summary": "String",
  "created_at": "ISO 8601 Date"
}
```

---

## 🔐 Security Features
- Pydantic input validation
- CORS restrictions
- Environment-based configuration
- Secure API key management (Gemini API)
- No sensitive data in logs (production)

---

## 📈 Performance Optimizations
- Async/await throughout backend
- MongoDB indexing strategy
- Connection pooling
- Lazy-loaded routes (Frontend)
- React.memo and useMemo for components
- Efficient SSE chunk streaming

---

## 🛠 Development Guidelines
- Backend: Pure async Python with FastAPI
- Frontend: Component-based React with Zustand state
- No external state management tools (Zustand only)
- Centralized API client for all requests
- Mobile-first responsive design

---

## 📝 License
MIT License - Copyright © 2026 Bikash Prasad Barnwal
