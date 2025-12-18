# Fimum - AI Assistant

A ChatGPT-like AI assistant built with Next.js 14, featuring multiple specialized AI models powered by OpenRouter API.

## Features

- 🤖 **Multi-Model Support**: Switch between different AI models for specialized tasks
- 💬 **Normal Chat**: General conversations using Nvidia Nemotron
- 💻 **Coding**: Programming help with Mistral Devstral
- 📚 **Study**: Educational content with AllenAI OLMo
- 🧠 **Thinking**: Deep reasoning combining two powerful models
- 🔬 **Deep Research**: In-depth analysis and exploration
- 💾 **Conversation History**: Save and manage multiple conversations
- 🎨 **Modern UI**: Beautiful, responsive interface inspired by ChatGPT and Grok
- ⚡ **Streaming Responses**: Real-time message streaming
- 📱 **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Markdown**: markdown-to-jsx
- **AI API**: OpenRouter

## Models Used

- **Normal Chat**: `nvidia/nemotron-nano-12b-v2-vl:free`
- **Coding**: `mistralai/devstral-2512:free`
- **Study**: `allenai/olmo-3.1-32b-think:free`
- **Thinking**: `allenai/olmo-3.1-32b-think:free` + `nvidia/nemotron-3-nano-30b-a3b:free`
- **Deep Research**: `nvidia/nemotron-3-nano-30b-a3b:free`

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fimum
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
fimum/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for chat completions
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page
├── components/
│   ├── ChatArea.tsx              # Main chat interface
│   ├── ChatInput.tsx             # Message input component
│   ├── MessageBubble.tsx         # Message display component
│   ├── ModelSelector.tsx         # Model mode selector
│   └── Sidebar.tsx               # Conversation history sidebar
├── contexts/
│   └── ChatContext.tsx           # Chat state management
├── lib/
│   ├── models.ts                 # Model configurations
│   └── storage.ts                # Local storage utilities
└── types/
    └── chat.ts                   # TypeScript type definitions
```

## Usage

1. **Start a New Conversation**: Click the "New Chat" button or select a model mode from the home screen

2. **Select a Mode**: Use the model selector dropdown to switch between different AI models:
   - Normal Chat for general questions
   - Coding for programming help
   - Study for learning topics
   - Thinking for complex reasoning
   - Deep Research for in-depth analysis

3. **Send Messages**: Type your message and press Enter or click the send button

4. **View History**: Access previous conversations from the sidebar

5. **Delete Conversations**: Hover over a conversation and click the trash icon

## Features in Detail

### Multi-Model Routing

The application automatically routes your requests to the appropriate AI model based on the selected mode. The "Thinking" mode combines responses from two models for enhanced reasoning.

### Conversation Management

All conversations are stored locally in your browser's localStorage, allowing you to return to previous chats anytime.

### Streaming Responses

Messages are streamed in real-time, providing a smooth and responsive user experience similar to ChatGPT.

### Responsive Design

The interface adapts beautifully to different screen sizes, with a collapsible sidebar on mobile devices.

## API Configuration

The OpenRouter API is configured in `/app/api/chat/route.ts`. The API key is currently hardcoded for demo purposes. For production use, store it in environment variables:

```env
OPENROUTER_API_KEY=your_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenRouter](https://openrouter.ai/)
- UI inspired by ChatGPT and Grok
