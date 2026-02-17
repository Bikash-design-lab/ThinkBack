# ThinkBack Frontend

AI-powered educational helpdesk platform built with modern React architecture.

## Tech Stack

- **React 19** + **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

## Architecture

### Clean Component-Based Structure

```
src/
├── Components/
│   ├── Common/          # Reusable UI components
│   ├── Pages/           # Page-level components
│   └── Data/            # Data display components
├── Services/            # API integration layer
├── Hooks/               # Custom React hooks
├── Types/               # TypeScript definitions
├── Styles/              # CSS architecture
├── utils/               # Helper functions
└── config/              # App configuration
```

### Key Features

**No External Packages**
- Custom `ScaleLoader` component built from scratch
- Pure CSS animations for optimal performance

**Type-Safe API Layer**
- Centralized service pattern (`api.service.ts`)
- Domain-specific services (tickets, chat)
- TypeScript interfaces matching backend schemas

**Custom Hooks**
- `useTickets` - Ticket state management
- `useSSEStream` - Real-time AI chat with session persistence

**CSS Design System**
- `variables.css` - Design tokens (colors, spacing, typography)
- `components.css` - Reusable component styles
- `utilities.css` - Utility classes

**SSE Streaming**
- Real-time AI responses without WebSockets
- Session storage for chat persistence across refreshes

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Principles

✅ **Component-based** - Modular, reusable components  
✅ **Clean architecture** - Clear separation of concerns  
✅ **Type safety** - TypeScript everywhere  
✅ **Custom solutions** - No unnecessary dependencies  
✅ **Performance first** - Optimized loaders and animations
