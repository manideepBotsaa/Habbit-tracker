// src/pages/AddHabit.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import GlassMorphism from "@/components/ui/GlassMorphism";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Clock,
  LightbulbIcon,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { ref, push } from "firebase/database";
import { db } from "../firebase";

const AddHabit: React.FC = () => {
  const { toast } = useToast();

  // State for form fields
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [formKey, setFormKey] = useState(0); // To reset Select components

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!habitName) {
      toast({
        title: "Error",
        description: "Habit name is required.",
        variant: "destructive",
      });
      return;
    }

    // Create habit object
    const newHabit = {
      name: habitName,
      description: habitDescription,
      frequency: frequency || "daily", // Default to "daily" if not selected
      reminderTime: reminderTime || null,
      category: category || "other", // Default to "other" if not selected
      startDate: startDate || new Date().toISOString().split("T")[0], // Default to today
      createdAt: new Date().toISOString(),
      completed: false, // Initial completion status
      completions: {}, // Initialize completions subnode
    };

    try {
      // Push the new habit to Firebase Realtime Database
      const habitsRef = ref(db, "habits");
      await push(habitsRef, newHabit);

      // Show success toast
      toast({
        title: "Habit created!",
        description: "Your new habit has been added to your dashboard.",
      });

      // Reset form
      setHabitName("");
      setHabitDescription("");
      setFrequency("");
      setReminderTime("");
      setCategory("");
      setStartDate("");
      setFormKey((prev) => prev + 1); // Reset Select components by changing key
    } catch (error) {
      console.error("Error creating habit:", error);
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto max-w-xl px-4 pb-24 pt-6 md:pb-16 md:pt-24">
        <div className="mb-8 space-y-2 text-center md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            Create <span className="text-gradient">New Habit</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Set up a new habit to track and build your streaks
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassMorphism className="flex items-start gap-4 p-4 glass">
            <div className="rounded-full bg-primary/10 p-2">
              <LightbulbIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">AI Recommendation</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with a small, achievable habit. The best habits are specific,
                measurable, and tied to a specific time of day.
              </p>
            </div>
          </GlassMorphism>
        </motion.div>

        <GlassMorphism className="p-6 glass">
          <form onSubmit={handleSubmit} key={formKey}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="habit-name" className="text-sm font-medium">
                  Habit Name
                </label>
                <Input
                  id="habit-name"
                  placeholder="e.g. Morning Meditation"
                  className="bg-white/50 dark:bg-black/20"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="habit-description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Input
                  id="habit-description"
                  placeholder="e.g. 10 minutes of mindfulness meditation"
                  className="bg-white/50 dark:bg-black/20"
                  value={habitDescription}
                  onChange={(e) => setHabitDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select onValueChange={setFrequency} value={frequency}>
                    <SelectTrigger className="bg-white/50 dark:bg-black/20">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reminder Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="time"
                      className="bg-white/50 pl-10 dark:bg-black/20"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select onValueChange={setCategory} value={category}>
                  <SelectTrigger className="bg-white/50 dark:bg-black/20">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="date"
                    className="bg-white/50 pl-10 dark:bg-black/20"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Habit Stacking Suggestion
                    </h4>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300/90">
                      Try connecting this habit with an existing one for better consistency.
                      For example: "After I brush my teeth, I will meditate for 5 minutes."
                    </p>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full">
                  Create Habit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </form>
        </GlassMorphism>
      </div>
    </PageTransition>
  );
};

export default AddHabit;