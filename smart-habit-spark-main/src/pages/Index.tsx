// src/pages/Index.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import HabitCard from "@/components/habits/HabitCard";
import GlassMorphism from "@/components/ui/GlassMorphism";
import Weather from "@/components/weather/Weather";
import { LightbulbIcon, TrendingUp, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ref, onValue, update, set } from "firebase/database";
import { db } from "../firebase";

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  reminderTime?: string | null;
  category: string;
  startDate: string;
  createdAt: string;
  time?: string;
  streak: number;
  completionRate: number;
  completed?: boolean;
  completions?: Record<string, boolean>; // e.g., { "2025-03-12": true }
}

const Index: React.FC = () => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [recommendation, setRecommendation] = useState({
    title: "AI Recommendation",
    text: "Try connecting a new habit to an existing one. For example, meditate right after brushing your teeth.",
  });
  const [weatherCondition, setWeatherCondition] = useState<
    "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
  >("sunny");
  const [weatherTemperature, setWeatherTemperature] = useState(24);

  // Calculate streak and completion rate based on completions
  const calculateHabitStats = (
    completions: Record<string, boolean> | undefined,
    startDate: string
  ) => {
    if (!completions) {
      return { streak: 0, completionRate: 0 };
    }

    const today = new Date();
    const start = new Date(startDate);
    const dates = Object.keys(completions).sort(); // Sort dates ascending

    // Calculate streak (longest consecutive days ending today)
    let streak = 0;
    const currentDate = new Date(today);
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (completions[dateStr]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate completion rate (last 30 days or since start)
    const daysSinceStart = Math.ceil(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const period = Math.min(daysSinceStart, 30); // Use last 30 days or since start
    let completedDays = 0;
    const periodStart = new Date(today);
    periodStart.setDate(today.getDate() - period + 1);
    for (let i = 0; i < period; i++) {
      const date = new Date(periodStart);
      date.setDate(periodStart.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      if (completions[dateStr]) completedDays++;
    }
    const completionRate = period > 0 ? Math.round((completedDays / period) * 100) : 0;

    return { streak, completionRate };
  };

  // Fetch habits from Firebase
  useEffect(() => {
    const habitsRef = ref(db, "habits");
    onValue(habitsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const habitsList: Habit[] = Object.entries(data).map(([key, value]: [string, Habit]) => {
          const stats = calculateHabitStats(value.completions, value.startDate);
          return {
            id: key,
            name: value.name,
            description: value.description,
            frequency: value.frequency,
            reminderTime: value.reminderTime,
            category: value.category,
            startDate: value.startDate,
            createdAt: value.createdAt,
            time: value.reminderTime || "",
            streak: stats.streak,
            completionRate: stats.completionRate,
            completed: value.completed || false,
            completions: value.completions || {},
          };
        });
        setHabits(habitsList);
      } else {
        setHabits([]);
      }
    });
  }, []);

  // Generate recommendations based on habits
  useEffect(() => {
    const generateRecommendation = () => {
      const readingHabit = habits.find((h) => h.name.toLowerCase().includes("read"));
      const meditationHabit = habits.find((h) => h.name.toLowerCase().includes("meditation"));
      const workoutHabit = habits.find((h) => h.name.toLowerCase().includes("workout"));
      const waterHabit = habits.find((h) => h.name.toLowerCase().includes("water"));

      if (readingHabit && meditationHabit) {
        const readingTime = readingHabit.time || "";
        const meditationTime = meditationHabit.time || "";

        const isReadingEvening = readingTime.includes("PM") && parseInt(readingTime.split(":")[0]) >= 6;
        const isMeditationEvening = meditationTime.includes("PM") && parseInt(meditationTime.split(":")[0]) >= 6;

        if ((readingHabit.completionRate < 85 || meditationHabit.completionRate < 85) &&
            (isReadingEvening || isMeditationEvening)) {
          return {
            title: "Evening Routine Optimization",
            text: "Try combining your meditation with reading to build a stronger evening routine. This could improve both habits!",
          };
        }
      }

      if (waterHabit && waterHabit.completionRate < 75) {
        return {
          title: "Hydration Reminder",
          text: "Set reminders throughout the day to drink water. Try the 8x8 rule: eight 8-ounce glasses daily.",
        };
      }

      if (workoutHabit && workoutHabit.streak < 7) {
        return {
          title: "Workout Consistency",
          text: "Morning workouts are easier to maintain. Try preparing your workout clothes the night before.",
        };
      }

      return {
        title: "Habit Stacking",
        text: "Try connecting a new habit to an existing one. For example, meditate right after brushing your teeth.",
      };
    };

    setRecommendation(generateRecommendation());

    const weatherTypes: Array<"sunny" | "cloudy" | "rainy" | "snowy" | "windy"> = [
      "sunny",
      "cloudy",
      "rainy",
      "snowy",
      "windy",
    ];
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const randomTemp = Math.floor(Math.random() * 15) + 15;
    setWeatherCondition(randomWeather);
    setWeatherTemperature(randomTemp);
  }, [habits]);

  // Handle habit completion
  const handleComplete = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    try {
      // Update local state
      const updatedHabits = habits.map((h) =>
        h.id === id ? { ...h, completed: true } : h
      );
      setHabits(updatedHabits);

      // Update Firebase
      const habitRef = ref(db, `habits/${id}`);
      const completionRef = ref(db, `habits/${id}/completions/${today}`);
      await set(completionRef, true);

      // Recalculate stats and update Firebase
      const stats = calculateHabitStats({ ...habit.completions, [today]: true }, habit.startDate);
      await update(habitRef, {
        completed: true,
        streak: stats.streak,
        completionRate: stats.completionRate,
        completions: { ...habit.completions, [today]: true },
      });

      toast({
        title: "Habit Completed",
        description: `You have completed the habit: ${habit.name}`,
      });
    } catch (error) {
      console.error("Error completing habit:", error);
      toast({
        title: "Error",
        description: "Failed to complete habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle habit skip
  const handleSkip = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    try {
      // Update local state
      const updatedHabits = habits.map((h) =>
        h.id === id ? { ...h, completed: false } : h
      );
      setHabits(updatedHabits);

      // Update Firebase
      const habitRef = ref(db, `habits/${id}`);
      await update(habitRef, { completed: false });

      toast({
        title: "Habit Skipped",
        description: "Don't worry, you can try again tomorrow!",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error skipping habit:", error);
      toast({
        title: "Error",
        description: "Failed to skip habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Calculate stats for the cards
  const totalHabits = habits.length;
  const weeklyProgress = habits.length > 0
    ? Math.round(habits.reduce((sum, habit) => sum + (habit.completionRate || 0), 0) / habits.length)
    : 0;
  const longestStreak = habits.length > 0
    ? Math.max(...habits.map((habit) => habit.streak || 0))
    : 0;

  return (
    <PageTransition>
      <div className="container mx-auto max-w-3xl px-4 pb-24 pt-6 md:pb-16 md:pt-24">
        <div className="mb-8 space-y-2 text-center md:mb-12">
          <Weather condition={weatherCondition} temperature={weatherTemperature} showEmoji={true} />
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-muted-foreground"
          >
            {formattedDate}
          </motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            Your <span className="text-gradient">SmartStreaks</span>
          </motion.h1>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="mb-8 grid grid-cols-3 gap-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
            }}
          >
            <GlassMorphism className="flex flex-col items-center justify-center p-4 text-center glass">
              <div className="mb-2 rounded-full bg-primary/10 p-2">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">{totalHabits}</span>
              <span className="text-xs text-muted-foreground">Total Habits</span>
            </GlassMorphism>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
            }}
          >
            <GlassMorphism className="flex flex-col items-center justify-center p-4 text-center glass">
              <div className="mb-2 rounded-full bg-green-500/10 p-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-2xl font-bold">{weeklyProgress}%</span>
              <span className="text-xs text-muted-foreground">Weekly Progress</span>
            </GlassMorphism>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
            }}
          >
            <GlassMorphism className="flex flex-col items-center justify-center p-4 text-center glass">
              <div className="mb-2 rounded-full bg-orange-500/10 p-2">
                <Award className="h-6 w-6 text-orange-500" />
              </div>
              <span className="text-2xl font-bold">{longestStreak}</span>
              <span className="text-xs text-muted-foreground">Longest Streak</span>
            </GlassMorphism>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <GlassMorphism className="flex items-start gap-4 p-4 glass">
            <div className="rounded-full bg-primary/10 p-2">
              <LightbulbIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">{recommendation.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{recommendation.text}</p>
            </div>
          </GlassMorphism>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Today's Habits</h2>
          <span className="text-sm text-muted-foreground">Swipe to complete</span>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {habits.length === 0 ? (
            <p className="text-muted-foreground text-balance">
              No habits yet. Start by creating one!
            </p>
          ) : (
            habits.map((habit) => (
              <motion.div
                key={habit.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                }}
              >
                <HabitCard
                  habit={habit}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Index;