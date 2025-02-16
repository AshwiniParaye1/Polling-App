"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreatePoll from "./components/CreatePoll";
import PollList from "./components/PollList";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [refreshPolls, setRefreshPolls] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center pb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Polling App
        </h1>
        <ThemeToggle />
      </div>

      <Card className="mb-8 bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Create & Vote Polls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <CreatePoll onPollCreated={() => setRefreshPolls(!refreshPolls)} />
            <PollList onPollVoted={() => setRefreshPolls(!refreshPolls)} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
