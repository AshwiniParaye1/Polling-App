import mongoose, { Schema, model, models } from "mongoose";

export interface PollOption {
  text: string;
  votes: number;
}

export interface IPoll extends mongoose.Document {
  question: string;
  options: PollOption[];
  createdAt: Date;
}

const PollSchema = new Schema<IPoll>({
  question: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Poll = models.Poll || model<IPoll>("Poll", PollSchema);

export default Poll;
