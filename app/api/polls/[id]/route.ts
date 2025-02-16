import dbConnect from "@/app/lib/mongodb";
import Poll from "@/app/models/Poll";
import { type NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();

    const poll = await Poll.findById(params.id);

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

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json();
    const { optionIndex } = body;

    if (optionIndex === undefined || optionIndex < 0) {
      return NextResponse.json(
        { error: "Invalid option index" },
        { status: 400 }
      );
    }

    await dbConnect();

    const poll = await Poll.findById(params.id);

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
