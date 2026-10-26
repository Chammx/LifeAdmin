import { NextRequest, NextResponse } from "next/server";

type Transaction = {
  title: string;
  amount: number;
  category: string;
  kind: "income" | "expense";
  date: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const transactions: Transaction[] = body.transactions;

    if (
      !Array.isArray(transactions) ||
      transactions.length > 5000 ||
      !transactions.every(
        (item) =>
          item &&
          typeof item.title === "string" &&
          typeof item.category === "string" &&
          typeof item.amount === "number" &&
          Number.isFinite(item.amount) &&
          item.amount >= 0 &&
          (item.kind === "income" || item.kind === "expense")
      )
    ) {
      return NextResponse.json(
        { error: "Please provide valid transaction data." },
        { status: 400 }
      );
    }

    const income = transactions
      .filter((item) => item.kind === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.kind === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const categories: Record<string, number> = {};

    for (const item of transactions) {
      if (item.kind === "expense") {
        categories[item.category] =
          (categories[item.category] || 0) + item.amount;
      }
    }

    const largestCategory = Object.entries(categories).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const suggestions: string[] = [];

    if (transactions.length === 0) {
      suggestions.push(
        "Record a few expenses to start understanding your spending."
      );
    } else {
      if (expenses > income && income > 0) {
        suggestions.push(
          "Your recorded expenses exceed your recorded income. Review optional spending before making new commitments."
        );
      }

      if (largestCategory) {
        suggestions.push(
          `${largestCategory[0]} is your largest recorded expense category at ₹${largestCategory[1].toLocaleString("en-IN")}. Review these purchases to see whether there are opportunities to save.`
        );
      }

      if (income > expenses && income > 0) {
        suggestions.push(
          `You have ₹${(income - expenses).toLocaleString("en-IN")} remaining across the transactions you recorded. Consider setting a realistic savings goal.`
        );
      }

      if (suggestions.length === 0) {
        suggestions.push(
          "Keep recording income and expenses to get more useful insights."
        );
      }
    }

    return NextResponse.json({
      income,
      expenses,
      net: income - expenses,
      largestCategory: largestCategory
        ? { name: largestCategory[0], amount: largestCategory[1] }
        : null,
      suggestions,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to calculate insights." },
      { status: 400 }
    );
  }
}
