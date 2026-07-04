"use client";
import { useEffect } from "react";
import PageFallback from "@/components/web/PageFallback";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PageFallback variant="error" onRetry={unstable_retry} />;
}
