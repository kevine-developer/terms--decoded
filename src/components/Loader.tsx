import { memo } from "react";
import { motion } from "framer-motion";

/**
 * Loader — Brutalist Editorial loading animation.
 * Accessible with role=status and aria-label.
 */
function LoaderComponent() {
  return (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="relative w-8 h-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-2 border-(--color-acid-lime)/20 border-t-(--color-acid-lime) shadow-[0_0_15px_var(--color-acid-lime-glow)]"
        />
        <div className="absolute inset-2 rounded-full bg-(--color-acid-lime) opacity-20 blur-sm animate-pulse" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

const Loader = memo(LoaderComponent);
export default Loader;
