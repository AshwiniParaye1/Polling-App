//components/CreatePoll.tsx

"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

interface CreatePollProps {
  onPollCreated: () => void;
}

const CreatePoll: React.FC<CreatePollProps> = ({ onPollCreated }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!question.trim()) {
      setError("Question is required.");
      toast.error("Question is required.");
      setIsSubmitting(false);
      return;
    }

    const trimmedOptions = options
      .map((option) => option.trim())
      .filter((option) => option !== "");

    if (trimmedOptions.length < 2) {
      setError("At least two options are required.");
      toast.error("At least two options are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/polls/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question, options: trimmedOptions })
      });

      if (!response.ok) {
        throw new Error("Failed to create poll");
      }

      setQuestion("");
      setOptions(["", ""]);
      onPollCreated();
      toast.success("Poll created successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create poll";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 transition-all">
      <h2 className="text-2xl font-semibold">Create a Poll</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="bg-gray-200 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="space-y-4">
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="bg-gray-200 dark:bg-gray-800 dark:text-white"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Poll"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePoll;
