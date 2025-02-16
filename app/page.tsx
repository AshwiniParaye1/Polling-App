// app/page.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreatePoll from "./components/CreatePoll";
import PollList from "./components/PollList";

export default function Home() {
  const [refreshPolls, setRefreshPolls] = useState(false);

  const handlePollCreated = () => {
    setRefreshPolls(!refreshPolls);
  };

  const handlePollVoted = () => {
    setRefreshPolls(!refreshPolls);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Polling App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <CreatePoll onPollCreated={handlePollCreated} />
            <PollList onPollVoted={handlePollVoted} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
