"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endsAt: string | Date;
  variant?: "small" | "large" | "inline";
  className?: string;
}

export function CountdownTimer({ endsAt, variant = "small", className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  } | null>(null);

  useEffect(() => {
    const end = new Date(endsAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isEnded: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  // Prevent hydration mismatch by not rendering until client is ready
  if (!timeLeft) return null;

  if (timeLeft.isEnded) {
    return (
      <div className={cn("text-xs font-semibold text-muted-foreground", className)}>
        Oferta terminada
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (variant === "inline") {
    return (
      <span className={cn("text-xs font-medium flex items-center gap-1", className)}>
        <Clock className="h-3 w-3" />
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    );
  }

  if (variant === "large") {
    return (
      <div className={cn("flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-3 shadow-sm", className)}>
        <Clock className="h-5 w-5 animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
            La oferta por tiempo limitado termina en:
          </span>
          <div className="flex items-center gap-2 text-lg font-extrabold tabular-nums">
            {timeLeft.days > 0 && (
              <>
                <span>{timeLeft.days}<span className="text-sm font-semibold opacity-70 ml-0.5">d</span></span>
                <span className="opacity-50">:</span>
              </>
            )}
            <span>{pad(timeLeft.hours)}<span className="text-sm font-semibold opacity-70 ml-0.5">h</span></span>
            <span className="opacity-50">:</span>
            <span>{pad(timeLeft.minutes)}<span className="text-sm font-semibold opacity-70 ml-0.5">m</span></span>
            <span className="opacity-50">:</span>
            <span className="text-red-500">{pad(timeLeft.seconds)}<span className="text-sm font-semibold opacity-70 ml-0.5">s</span></span>
          </div>
        </div>
      </div>
    );
  }

  // default: small
  return (
    <div className={cn("flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border border-border/50 text-foreground px-2 py-1 rounded-md text-[10px] font-bold tabular-nums shadow-sm", className)}>
      <Clock className="h-3 w-3 text-red-500" />
      {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
      <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
    </div>
  );
}
