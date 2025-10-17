import React, { useEffect } from "react";

type Props = {
  type: "success" | "error";
  message: string;
  onDone?: () => void;
  durationMs?: number;
};

export default function StatusToast({
  type,
  message,
  onDone,
  durationMs = 1400,
}: Props) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), durationMs);
    return () => clearTimeout(t);
  }, [durationMs, onDone]);

  const isSuccess = type === "success";
  const circleStroke = isSuccess ? "#2FA86E" : "#E95A5A";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 min-w-[280px] flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={circleStroke}
              strokeWidth="8"
              className={isSuccess ? "animate-draw-circle" : ""}
            />
            {isSuccess ? (
              <path
                d="M30 52 L45 67 L72 40"
                fill="none"
                stroke={circleStroke}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-draw-check"
              />
            ) : (
              <>
                <path
                  d="M35 35 L65 65"
                  fill="none"
                  stroke={circleStroke}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="animate-draw-cross-1"
                />
                <path
                  d="M65 35 L35 65"
                  fill="none"
                  stroke={circleStroke}
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="animate-draw-cross-2"
                />
              </>
            )}
          </svg>
        </div>
        <p
          className={`text-xl font-semibold ${
            isSuccess ? "text-emerald-800" : "text-red-700"
          } text-center`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
