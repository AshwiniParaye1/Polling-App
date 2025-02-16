import dbConnect from "@/app/lib/mongodb";
import Poll from "@/app/models/Poll";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = await context.params;
    const poll = await Poll.findById(id);

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    return NextResponse.json(poll);
  } catch (error: any) {
    console.error("Failed to fetch poll:", error);
    return NextResponse.json(
      { error: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { optionIndex } = body;

    if (optionIndex === undefined || optionIndex < 0) {
      return NextResponse.json(
        { error: "Invalid option index" },
        { status: 400 }
      );
    }

    await dbConnect();

    const { id } = await context.params;
    const poll = await Poll.findById(id);

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    if (optionIndex >= poll.options.length) {
      return NextResponse.json(
        { error: "Invalid option index" },
        { status: 400 }
      );
    }

    poll.options[optionIndex].votes++;
    await poll.save();

    return NextResponse.json({ message: "Vote recorded", poll });
  } catch (error: any) {
    console.error("Failed to update poll:", error);
    return NextResponse.json(
      { error: "Failed to update poll" },
      { status: 500 }
    );
  }
}
