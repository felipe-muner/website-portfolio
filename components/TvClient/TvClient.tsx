// /components/TvClient.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SessionsList from "@/components/SessionList/SessionList";
import TvTips from "./TvTips";
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
    () => <OurPlan isTv />,
    () => <SessionsList sessions={sessions} isTv />,
    () => <TvTips />,
  ];

  // Rotate through components every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % components.length);
    }, 50000);
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
          className="absolute w-full h-full flex flex-col justify-start items-center px-8"
        >
          {components[index]()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
