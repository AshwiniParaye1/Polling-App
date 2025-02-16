# Polling App

A real-time polling application built with Next.js, TypeScript, and MongoDB. Users can create polls, vote, and view dynamic results.

## Features

- Create polls with a question and multiple options.
- Vote for an option in any poll.
- Real-time results with a live-updating chart.
- Automatic poll updates every few seconds.
- Full-stack Next.js API routes for poll management.
- MongoDB integration for persistent storage.
- Tailwind CSS UI for a modern, responsive design.

## 📂 Project Structure

```bash
quick-polling-app/
├── app/
│   ├── polls/
│   │   ├── [id]/
│   │   │   └── page.tsx       # Poll detail page
│   │   ├── create/
│   │   │   └── page.tsx       # Poll creation page
│   │   └── page.tsx           # Poll listing page
│   ├── api/
│   │   ├── polls/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts   # API to fetch & update a poll
│   │   │   ├── create/
│   │   │   │   └── route.ts   # API to create a new poll
│   │   │   └── route.ts       # API to fetch all polls
├── components/
│   ├── CreatePoll.tsx         # Poll creation form
│   ├── PollList.tsx           # List of polls
│   └── PollDetail.tsx         # Poll detail component
├── lib/
│   └── mongodb.ts             # MongoDB connection setup
├── models/
│   └── Poll.ts                # Mongoose Poll model
├── .env.local                 # Environment variables
├── package.json
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AshwiniParaye1/Polling-App.git
cd Polling-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the Application

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint            | Description        |
| :----- | :------------------ | :----------------- |
| `GET`  | `/api/polls`        | Fetch all polls    |
| `POST` | `/api/polls/create` | Create a new poll  |
| `GET`  | `/api/polls/{id}`   | Get a poll by ID   |
| `PUT`  | `/api/polls/{id}`   | Vote for an option |

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) (Pie chart for poll results)
- [Lucide React](https://lucide.dev/) (Icons)

## UI Components

- `CreatePoll.tsx`: Poll creation form. Allows users to create new polls by entering a question and multiple options. Includes validation to ensure a valid poll is created.
- `PollList.tsx`: Displays a list of polls. Fetches and renders all available polls from the database, providing a user-friendly overview of active polls.
- `PollDetail.tsx`: Poll page with voting and results. Shows the details of a specific poll, including the question, options, and a real-time updating chart of the voting results. Handles user voting and updates the chart dynamically.

## Development Notes

- **Database Connection:** `lib/mongodb.ts` sets up a persistent MongoDB connection.
- **Real-time Poll Updates:** Poll data refreshes every 5 seconds using `setInterval()`.
- **Validation:** Ensures that polls have at least two options before submission.
- **Error Handling:** Provides alerts when API calls fail.

## Usage

#### ➤ Create a Poll

1.  Open the app and click "Create Poll".
2.  Enter a question and at least two options.
3.  Click "Submit" to generate the poll link.

#### ➤ Vote on a Poll

1.  Open a poll and select an option.
2.  Click "Vote" to submit.
3.  Results update in real-time.

#### ➤ View Poll Results

1.  A pie chart displays live results.
2.  Share the poll link to get more votes.

#### ➤ Browse Polls

1.  The homepage shows active polls.
2.  Click a poll to vote or view results.

---

Thank you for checking out PollingApp! If you have any questions or feedback, feel free to reach out.

Happy coding! 🚀

Connect with me on [LinkedIn](https://www.linkedin.com/in/ashwini-paraye/).
