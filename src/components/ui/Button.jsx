"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Button({ children, className = "", variant = "primary", size = "md", href, target, rel, type = "button", disabled = false, arrow = true, ...props }) {
  const reducedMotion = useReducedMotion();
  const Component = href ? motion.a : motion.button;
  const external = href?.startsWith("http");
  return (
    <Component
      className={cn("button", `button--${variant}`, `button--${size}`, className)}
      {...(href ? { href, target: target || (external ? "_blank" : undefined), rel: rel || (external ? "noopener noreferrer" : undefined) } : { type, disabled })}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <span>{children}</span>
      {arrow && <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />}
    </Component>
  );
}
