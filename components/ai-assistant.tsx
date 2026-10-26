"use client";

import { FormEvent, useState } from "react";
import { Send, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const suggestions = [
  "What needs my attention this week?",
  "When does my insurance expire?",
  "Which payments are coming up?",
  "What documents should I organize?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "Hi! I’m your LifeAdmin assistant. Ask me about deadlines, documents, subscriptions, payments, or anything you’ve stored in your LifeAdmin workspace.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text?: string) {
    const value = (text ?? input).trim();

    if (!value || loading) return;

    setInput("");

    const userMessage: Message = {
      role: "user",
      text: value,
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
          history: messages,
        }),
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data.reply ||
            "I couldn't process that request. Please try again.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            "The AI service is not connected yet. Add your OPENAI_API_KEY to .env.local and restart the development server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="assistant-layout">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`message ${message.role === "user" ? "user" : "ai"}`}
          >
            <div className="message-bubble">{message.text}</div>
            <div className="message-time">
              {message.role === "user" ? "You" : "LifeAdmin AI"}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message ai">
            <div className="message-bubble">
              <div className="typing">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="suggestions">
        {suggestions.map((suggestion) => (
          <button
            className="suggestion-chip"
            key={suggestion}
            onClick={() => sendMessage(suggestion)}
            disabled={loading}
          >
            <Sparkles size={11} style={{ marginRight: 4 }} />
            {suggestion}
          </button>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={submit}>
        <textarea
          className="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask LifeAdmin anything..."
          rows={1}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
        />

        <button className="chat-send" type="submit" disabled={loading}>
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
