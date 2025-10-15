import React from "react";
import { useRouter } from "next/router";

type Props = {
  message?: string;
  onClose?: () => void;
};

export default function SuccessCheck({
  message = "Ad created!",
  onClose,
}: Props) {
  const router = useRouter();
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl p-8 min-w-[280px] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={onClose}
          title="Close"
        >
          <span className="text-lg leading-none">×</span>
        </button>
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2FA86E"
              strokeWidth="8"
              className="animate-draw-circle"
            />
            <path
              d="M30 52 L45 67 L72 40"
              fill="none"
              stroke="#2FA86E"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-check"
            />
          </svg>
        </div>
        <p className="text-xl font-semibold text-emerald-800 text-center">
          {message}
        </p>
        <button
          onClick={() => router.push("/yourtools")}
          className="mt-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Go to My Ads
        </button>
      </div>

      {/* styles moved to globals.css */}
    </div>
  );
}
