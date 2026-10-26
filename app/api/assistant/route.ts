import { NextResponse } from "next/server";
import OpenAI from "openai";

type HistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = String(body.message || "").trim();
    const history = Array.isArray(body.history)
      ? (body.history as HistoryMessage[])
      : [];

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: localFallback(message),
        mode: "demo",
      });
    }

    const client = new OpenAI({
      apiKey,
    });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const conversation = history
      .slice(-8)
      .map((item) => `${item.role}: ${item.text}`)
      .join("\n");

    const response = await client.responses.create({
      model,
      instructions: `
You are LifeAdmin AI, a concise personal life-administration assistant.

Your job is to help users organize:
- documents
- bills
- subscriptions
- warranties
- insurance
- deadlines
- renewals
- recurring responsibilities

Be practical and concise.
Do not pretend to have access to documents or data that were not provided.
If information is missing, say what is missing.
Never invent dates, amounts, policies, account details, or personal records.
For legal, medical, financial, or safety-critical matters, explain that the user should verify information with the relevant professional or official source.
`,
      input: `
Previous conversation:
${conversation}

Current user message:
${message}
`,
    });

    return NextResponse.json({
      reply:
        response.output_text ||
        "I couldn't generate a response. Please try again.",
      mode: "ai",
    });
  } catch (error) {
    console.error("LifeAdmin AI error:", error);

    return NextResponse.json(
      {
        reply:
          "The AI service returned an error. Check your API key and OPENAI_MODEL configuration, then restart the development server.",
      },
      { status: 500 }
    );
  }
}

function localFallback(message: string) {
  const text = message.toLowerCase();

  if (
    text.includes("attention") ||
    text.includes("deadline") ||
    text.includes("week")
  ) {
    return "Based on your demo workspace, the most important items are your insurance renewal in 3 days, internet payment in 6 days, and vehicle service in 12 days. In the real version, I’ll calculate this from your actual LifeAdmin data.";
  }

  if (text.includes("insurance")) {
    return "Your demo workspace shows a car insurance renewal in 3 days. In the full version, LifeAdmin will read the actual policy expiry date from your uploaded document.";
  }

  if (
    text.includes("payment") ||
    text.includes("bill") ||
    text.includes("subscription")
  ) {
    return "Your demo workspace has an internet payment due in 6 days and 8 tracked subscriptions. The production version will calculate upcoming payments from your actual records.";
  }

  if (text.includes("document")) {
    return "Start with high-value documents: insurance policies, vehicle documents, warranties, receipts, certificates and recurring bills. Upload them once and LifeAdmin can organize their important dates.";
  }

  return "I’m currently running in demo mode. Once you add OPENAI_API_KEY to .env.local, I can use the AI model. The production version will also connect the assistant to your LifeAdmin database so it can answer questions about your actual records.";
}
