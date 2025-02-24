// /components/TvClient.tsx
'use client';

import { useState, useEffect } from "react";
import useSWR from "swr";
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

// Define a simple fetcher function.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TvClient() {
  const [index, setIndex] = useState(0);

  // Use SWR to fetch sessions from the API endpoint every 60 seconds.
  const { data: sessions, error } = useSWR<Session[]>("/api/sessions", fetcher, {
    refreshInterval: 60000,
  });

  console.log('123123', sessions);
  
  // Define the rotating components.
  const components = [
    () =>
      sessions ? (
        <SessionsList sessions={sessions} isTv />
      ) : (
        <div className="text-white">Loading sessions...</div>
      ),
    () => <OurPlan isTv />,
    () => <TvTips />,
  ];

  // Rotate through components every 20 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % components.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [components.length]);

  if (error) {
    return <div className="text-red-500">Error loading sessions</div>;
  }

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
