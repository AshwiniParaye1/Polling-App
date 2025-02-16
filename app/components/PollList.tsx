//components/PollList.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { IPoll } from "../models/Poll";

interface PollListProps {
  onPollVoted: () => void;
}

const PollList: React.FC<PollListProps> = ({ onPollVoted }) => {
  const [polls, setPolls] = useState<IPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("/api/polls");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch polls");
        }

        const data = await response.json();
        setPolls(data);
        setError("");
      } catch (err) {
        console.error("Poll fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [onPollVoted]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Current Polls</h2>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Current Polls</h2>
      {polls.length === 0 ? (
        <p className="text-muted-foreground">No polls available.</p>
      ) : (
        <ul className="space-y-2">
          {polls.map((poll) => (
            <li
              key={poll._id?.toString()}
              className="rounded-lg border p-4 hover:bg-accent"
            >
              <Link
                href={`/polls/${poll._id}`}
                className="block text-lg hover:underline"
              >
                {poll.question}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PollList;
