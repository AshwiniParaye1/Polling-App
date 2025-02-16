import dbConnect from "@/app/lib/mongodb";
import Poll from "@/app/models/Poll";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const polls = await Poll.find({}).sort({ createdAt: -1 });

    return NextResponse.json(polls);
  } catch (error) {
    console.error("Failed to fetch polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, options } = body;

    if (!question || !options || options.length < 2) {
      return NextResponse.json({ error: "Invalid poll data" }, { status: 400 });
    }

    await dbConnect();
    const poll = new Poll({
      question,
      options: options.map((option: string) => ({ text: option, votes: 0 }))
    });

    await poll.save();
    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("Failed to create poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
