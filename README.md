# TaskFork

A developer-focused task management application designed for software engineers and startup founders who value keyboard-driven workflows and code-like interfaces.

```
                     ┌──────────────────┐
                     │                  │
                     │    TaskFork      │
                     │                  │
                     └───────┬──────────┘
                             │
           ┌─────────────────┼──────────────────┐
           │                 │                  │
           ▼                 ▼                  ▼
┌────────────────┐  ┌─────────────────┐  ┌────────────────┐
│                │  │                 │  │                │
│  Work Tasks    │  │  Personal Tasks │  │  Side Projects │
│                │  │                 │  │                │
└────┬───────────┘  └────┬────────────┘  └────┬───────────┘
     │                   │                     │
     ▼                   ▼                     ▼
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────┐  ┌────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Task │  │  Task  │  │    Task     │  │    Task     │  │
│  │ #001 │  │  #002  │  │    #003     │  │    #004     │  │
│  │      │  │        │  │             │  │             │  │
│  └──────┘  └────────┘  └─────────────┘  └─────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
           ┌─────────────┐            ┌──────────────┐ 
           │ Markdown    │            │ Keyboard     │
           │ Descriptions│            │ Shortcuts    │
           └─────────────┘            └──────────────┘
```

## Features

- 🖥️ **Multiple Workspaces** - Separate contexts for work, personal, and side projects
- ⌨️ **Keyboard Shortcuts** - Optimized for developers who prefer keyboard over mouse
- 📝 **Markdown Support** - Add detailed task descriptions with code snippets and formatting
- 🎨 **Multiple Themes** - Choose from Slate Dark, Monokai, Dracula, and Nord
- 💾 **Persistent Storage** - Tasks are saved to localStorage with workspace separation
- 📱 **Responsive Design** - Works well on desktop and mobile devices

## Tech Stack

- React 
- Vite
- Tailwind CSS
- React Markdown

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Keyboard Shortcuts

- `?` - Show keyboard shortcuts
- `Ctrl+K` / `Cmd+K` - Toggle shortcuts panel
- `Ctrl+Enter` / `Cmd+Enter` - Add/update task
- `Ctrl+Shift+T` / `Cmd+Shift+T` - Cycle through themes
- `Esc` - Close dialogs

## License

MIT
