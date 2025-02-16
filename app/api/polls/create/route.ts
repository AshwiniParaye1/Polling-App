import dbConnect from "@/app/lib/mongodb";
import Poll from "@/app/models/Poll";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    return NextResponse.json(
      { message: "Poll created successfully", poll },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
