import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg"|"xlg";
}

export default function LoadingSpinner({
  message = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  // Ukubwa wa spinner kulingana na prop ya size
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-b-2",
    lg: "h-12 w-12 border-b-4",

    xlg: "h-16 w-16 border-b-8",
  };

  return (
    <div className="flex justify-center items-center py-12 w-full">
      <div
        className={`animate-spin rounded-full border-emerald-600 ${sizeClasses[size]}`}
      ></div>
      {message && <span className="ml-3 text-sm text-gray-500 font-medium">{message}</span>}
    </div>
  );
}