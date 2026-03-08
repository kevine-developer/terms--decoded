import { memo } from "react";
import { clsx } from "clsx";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost";
  /** Accessible label if children is not descriptive enough */
  ariaLabel?: string;
  /** HTML type attribute */
  type?: "button" | "submit" | "reset";
}

/**
 * ActionButton — The hero CTA button (Brutalist Editorial).
 * Primary variant: Acid Lime background, bold uppercase, scan-line hover effect.
 * Secondary: Graphite background with lime border.
 * Ghost: Transparent with text only.
 */
import { motion } from "framer-motion";

function ActionButtonComponent({
  onClick,
  disabled = false,
  children,
  variant = "primary",
  ariaLabel,
  type = "button",
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={clsx(
        "relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-display font-bold uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden group",
        isPrimary
          ? "bg-(--color-acid-lime) text-(--color-void) shadow-[0_0_20px_rgba(200,255,0,0.1)] hover:shadow-[0_0_40px_rgba(200,255,0,0.3)]"
          : "bg-(--color-graphite) text-(--color-off-white) border border-(--color-glass-border) hover:border-(--color-acid-lime)/50",
        disabled && "opacity-40 grayscale cursor-not-allowed",
      )}
    >
      {/* Glossy Overlay */}
      {!disabled && isPrimary && (
        <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Subtle Scanline / Shine */}
      {!disabled && isPrimary && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none"
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

const ActionButton = memo(ActionButtonComponent);
export default ActionButton;
