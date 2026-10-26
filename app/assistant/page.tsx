"use client";

import { Sparkles } from "lucide-react";
import AppShell from "@/components/app-shell";
import AIAssistant from "@/components/ai-assistant";

export default function AssistantPage() {
  return (
    <AppShell>
      <main className="assistant-page">
        <div className="assistant-header">
          <h1>LifeAdmin AI</h1>
          <p>
            Ask questions about your documents, deadlines, payments and
            responsibilities.
          </p>
        </div>

        <AIAssistant />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            color: "#999da7",
            fontSize: 10,
          }}
        >
          <Sparkles size={12} />
          AI responses should be verified before making important decisions.
        </div>
      </main>
    </AppShell>
  );
}
