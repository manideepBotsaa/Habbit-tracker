import React from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";
import GlassMorphism from "@/components/ui/GlassMorphism";
import ProfilePicture from "@/components/profile/ProfilePicture";
import { 
  Award, 
  BarChart3, 
  Calendar, 
  Flame,
  LineChart,
  Timer,
  TrendingUp, 
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";

const weeklyData = [
  { name: "Mon", completed: 4 },
  { name: "Tue", completed: 3 },
  { name: "Wed", completed: 5 },
  { name: "Thu", completed: 2 },
  { name: "Fri", completed: 4 },
  { name: "Sat", completed: 3 },
  { name: "Sun", completed: 4 },
];

const monthlyData = [
  { name: "Week 1", rate: 65 },
  { name: "Week 2", rate: 75 },
  { name: "Week 3", rate: 82 },
  { name: "Week 4", rate: 78 },
];

const achievements = [
  { id: 1, name: "Early Bird", description: "Complete 5 morning habits", icon: Calendar, color: "text-blue-500" },
  { id: 2, name: "On Fire", description: "Maintain a 7-day streak", icon: Flame, color: "text-orange-500" },
  { id: 3, name: "Consistent", description: "85% completion rate", icon: TrendingUp, color: "text-green-500" },
  { id: 4, name: "Quick Start", description: "Add 3 habits", icon: Timer, color: "text-purple-500" },
];

const Profile: React.FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-3xl px-4 pb-24 pt-6 md:pb-16 md:pt-24">
        <div className="mb-8 text-center md:mb-12">
          <ProfilePicture />
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            Your <span className="text-gradient">Profile</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-2 flex items-center justify-center gap-3 text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Longest Streak: 12 days</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>78% Completion Rate</span>
            </div>
          </motion.div>
        </div>
        
        <div className="mb-10 grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassMorphism className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-primary" />
                Daily Habits Completed
              </h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 6]} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }} 
                    />
                    <Bar 
                      dataKey="completed" 
                      fill="url(#barGradient)" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassMorphism>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassMorphism className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <LineChart className="h-5 w-5 text-primary" />
                Monthly Completion Rate
              </h2>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis domain={[50, 100]} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ strokeWidth: 2, r: 4, fill: "white" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </GlassMorphism>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-4 text-xl font-semibold">Achievements</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <GlassMorphism 
                key={achievement.id}
                className="flex items-center gap-4 p-4"
                intensity="light"
              >
                <div className={`rounded-full bg-white p-2 dark:bg-gray-800 ${achievement.color}`}>
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </GlassMorphism>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Profile;
