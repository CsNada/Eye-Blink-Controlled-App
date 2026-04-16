import React from "react";
import { useBlink } from "../contexts/BlinkContext";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface FocusableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export function FocusableButton({
  index,
  children,
  onClick,
  className,
  variant = "default",
  ...props
}: FocusableButtonProps) {
  const { focusedIndex } = useBlink();
  const isFocused = focusedIndex === index;

  return (
    <Button
      data-blink-index={index}
      onClick={onClick}
      variant={variant}
      className={cn(
        "relative transition-all duration-300 min-h-[64px]",
        isFocused && [
          "ring-4 ring-blue-400/60 scale-105 shadow-2xl shadow-blue-500/30 z-10",
          "before:absolute before:inset-0 before:rounded-[inherit] before:bg-blue-400/10 before:animate-pulse",
        ],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}