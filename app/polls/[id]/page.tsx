//app/polls/[id]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { IPoll } from "@/app/models/Poll";
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollDetail() {
  const params = useParams();
  const id = params.id;

  const [poll, setPoll] = useState<IPoll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voteError, setVoteError] = useState("");
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch poll");
        }
        const data = await response.json();
        setPoll(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
    const intervalId = setInterval(fetchPoll, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption) {
      setVoteError("Please select an option.");
      return;
    }

    setVoteError("");
    setIsVoting(true);

    try {
      const optionIndex = parseInt(selectedOption);
      const response = await fetch(`/api/polls/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ optionIndex })
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      const data = await response.json();
      setPoll(data.poll);
      setSelectedOption(null);
    } catch (err) {
      setVoteError(
        err instanceof Error ? err.message : "Failed to submit vote"
      );
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error || "Poll not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const chartData = {
    labels: poll.options.map((option) => option.text),
    datasets: [
      {
        data: poll.options.map((option) => option.votes),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <CardTitle className="text-2xl font-semibold text-center text-black dark:text-white">
            {poll.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Voting Section */}
            <div className="space-y-6">
              {voteError && (
                <Alert variant="destructive">
                  <AlertDescription>{voteError}</AlertDescription>
                </Alert>
              )}
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={setSelectedOption}
                className="space-y-3"
              >
                {poll.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all mt-8"
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 text-black dark:text-white"
                    >
                      {option.text}
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        ({option.votes} votes)
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button
                onClick={handleVote}
                disabled={isVoting || !selectedOption}
                className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-black font-medium py-2 px-4 rounded-md transition-all"
              >
                {isVoting ? "Voting..." : "Vote"}
              </Button>
            </div>

            {/* Chart Section */}
            <div className="aspect-square flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 rounded-md mt-8 w-full h-96">
              {poll.options.every((option) => option.votes === 0) ? (
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  No votes yet. Be the first to vote!
                </p>
              ) : (
                <Pie
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom"
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Home Button */}
          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-medium py-2 px-6 rounded-md transition-all">
                ⬅️ Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
