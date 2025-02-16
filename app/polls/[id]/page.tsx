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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              {voteError && (
                <Alert variant="destructive">
                  <AlertDescription>{voteError}</AlertDescription>
                </Alert>
              )}
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={setSelectedOption}
              >
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1">
                      {option.text}
                      <span className="ml-2 text-muted-foreground">
                        ({option.votes} votes)
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button
                onClick={handleVote}
                disabled={isVoting || !selectedOption}
                className="w-full"
              >
                {isVoting ? "Voting..." : "Vote"}
              </Button>
            </div>
            <div className="aspect-square">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
