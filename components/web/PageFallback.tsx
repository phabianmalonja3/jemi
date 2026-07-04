"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaHome, FaSearch, FaRedoAlt } from "react-icons/fa";
import { FALLBACK_PAGE_CONTENT, type FallbackVariant } from "@/lib/constants/fallback";

type PageFallbackProps = {
  variant: FallbackVariant;
  onRetry?: () => void;
};

const PageFallback = ({ variant, onRetry }: PageFallbackProps) => {
  const content = FALLBACK_PAGE_CONTENT[variant];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-extrabold text-emerald-900 dark:text-emerald-500 opacity-20">
            {content.code}
          </h1>
          <div className="-mt-20 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              {content.title}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
              {content.description}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {content.actions.map((action) => {
            const key = `${action.type}-${action.label}`;

            if (action.type === "retry") {
              return (
                <Button
                  key={key}
                  onClick={onRetry}
                  className="w-full sm:w-auto bg-emerald-900 hover:bg-emerald-800 text-white gap-2 h-12 px-8"
                >
                  <FaRedoAlt /> {action.label}
                </Button>
              );
            }

            const Icon = action.href === "/" ? FaHome : FaSearch;
            const isOutline = action.variant === "outline";

            return (
              <Link href={action.href} key={key}>
                <Button
                  variant={isOutline ? "outline" : "default"}
                  className={
                    isOutline
                      ? "w-full sm:w-auto gap-2 h-12 px-8 border-zinc-300 dark:border-zinc-700"
                      : "w-full sm:w-auto bg-emerald-900 hover:bg-emerald-800 text-white gap-2 h-12 px-8"
                  }
                >
                  <Icon /> {action.label}
                </Button>
              </Link>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-16 opacity-10 flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-32 h-32 border-4 border-dashed border-emerald-900 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default PageFallback;
