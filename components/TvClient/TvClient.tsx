// /components/TvClient.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SessionsList from "@/components/SessionList/SessionList";
import { OurPlan } from "../OurPlan";

interface Session {
  id: number;
  classname: string;
  teacher: string;
  startDatetime: string | Date;
  endDatetime: string | Date;
}

interface TvClientProps {
  sessions: Session[];
}

export default function TvClient({ sessions }: TvClientProps) {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  // Refresh the page every 60 seconds to fetch updated sessions.
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      router.refresh();
    }, 60000);
    return () => clearInterval(refreshInterval);
  }, [router]);

  // Define the rotating components. One of these is the sessions list.
  const components = [
    () => <SessionsList sessions={sessions} isAdmin={false} />,
    () => <OurPlan isAdmin={false} />,
    // () => <div className="text-3xl font-bold text-white">Component 2</div>,
    // () => <div className="text-3xl font-bold text-white">Component 4</div>,
    // () => <div className="text-3xl font-bold text-white">Component 5</div>,
  ];

  // Rotate through components every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % components.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [components.length]);

  return (
    <div className="flex items-center justify-center h-screen bg-black relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute w-full px-8"
        >
          {components[index]()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
