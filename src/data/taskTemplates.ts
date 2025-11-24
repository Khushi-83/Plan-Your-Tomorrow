import { Task } from "@/components/TaskCard";

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: "morning" | "work" | "exercise" | "evening";
  icon: string;
  tasks: Omit<Task, "id" | "completed">[];
}

export const taskTemplates: TaskTemplate[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "Start your day right with a healthy morning routine",
    category: "morning",
    icon: "☀️",
    tasks: [
      {
        title: "Wake up & hydrate",
        duration: "5 min",
        urgency: 5,
        importance: 4,
        color: "sky",
        notes: "Drink a glass of water",
      },
      {
        title: "Morning exercise",
        duration: "20 min",
        urgency: 4,
        importance: 5,
        color: "mint",
        notes: "Stretching or light workout",
      },
      {
        title: "Healthy breakfast",
        duration: "15 min",
        urgency: 4,
        importance: 4,
        color: "peach",
        notes: "Prepare and eat a nutritious meal",
      },
      {
        title: "Plan the day",
        duration: "10 min",
        urgency: 5,
        importance: 5,
        color: "lavender",
        notes: "Review goals and priorities",
      },
    ],
  },
  {
    id: "work-focus",
    name: "Work Focus Session",
    description: "Productive work session with breaks",
    category: "work",
    icon: "💼",
    tasks: [
      {
        title: "Review emails & messages",
        duration: "15 min",
        urgency: 4,
        importance: 3,
        color: "sky",
        notes: "Check and respond to urgent communications",
      },
      {
        title: "Deep work session",
        duration: "90 min",
        urgency: 5,
        importance: 5,
        color: "lavender",
        notes: "Focus on most important task",
      },
      {
        title: "Short break",
        duration: "10 min",
        urgency: 3,
        importance: 4,
        color: "mint",
        notes: "Walk around, stretch, hydrate",
      },
      {
        title: "Team check-in",
        duration: "30 min",
        urgency: 4,
        importance: 4,
        color: "peach",
        notes: "Sync with team members",
      },
    ],
  },
  {
    id: "exercise-routine",
    name: "Full Workout",
    description: "Complete exercise routine for fitness",
    category: "exercise",
    icon: "💪",
    tasks: [
      {
        title: "Warm-up",
        duration: "10 min",
        urgency: 5,
        importance: 5,
        color: "peach",
        notes: "Dynamic stretching and light cardio",
      },
      {
        title: "Strength training",
        duration: "30 min",
        urgency: 4,
        importance: 5,
        color: "mint",
        notes: "Focus on major muscle groups",
      },
      {
        title: "Cardio session",
        duration: "20 min",
        urgency: 4,
        importance: 4,
        color: "sky",
        notes: "Running, cycling, or HIIT",
      },
      {
        title: "Cool down & stretch",
        duration: "10 min",
        urgency: 5,
        importance: 4,
        color: "lavender",
        notes: "Static stretching and breathing",
      },
    ],
  },
  {
    id: "evening-routine",
    name: "Evening Wind Down",
    description: "Relax and prepare for quality sleep",
    category: "evening",
    icon: "🌙",
    tasks: [
      {
        title: "Dinner & cleanup",
        duration: "45 min",
        urgency: 4,
        importance: 4,
        color: "peach",
        notes: "Healthy meal and tidy kitchen",
      },
      {
        title: "Review the day",
        duration: "10 min",
        urgency: 3,
        importance: 4,
        color: "lavender",
        notes: "Journal or reflect on accomplishments",
      },
      {
        title: "Prepare for tomorrow",
        duration: "15 min",
        urgency: 4,
        importance: 5,
        color: "sky",
        notes: "Set out clothes, pack bag, plan tasks",
      },
      {
        title: "Relaxation time",
        duration: "30 min",
        urgency: 3,
        importance: 5,
        color: "mint",
        notes: "Read, meditate, or light hobby",
      },
    ],
  },
];
