"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  delay = 0,
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  strong?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
      className={`glass-card ${strong ? "glass-card-strong" : ""} p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
