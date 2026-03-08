import { useState, useEffect, useCallback, memo } from "react";

interface GlitchTextProps {
  /** The final text to display after the scramble effect completes */
  text: string;
  /** Whether the scramble animation is currently active */
  isAnimating?: boolean;
  /** CSS class name for styling */
  className?: string;
  /** Duration of the entire scramble animation in milliseconds */
  duration?: number;
  /** Characters used during the scramble effect */
  charset?: string;
  /** Aria label for screen readers (uses text if not provided) */
  ariaLabel?: string;
}

const DEFAULT_CHARSET = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFabcdef0123456789";

/**
 * GlitchText — Displays text with a "decryption" scramble animation.
 * Characters resolve one by one from random to final text.
 * Respects prefers-reduced-motion by skipping animation.
 */
function GlitchTextComponent({
  text,
  isAnimating = false,
  className = "",
  duration = 1500,
  charset = DEFAULT_CHARSET,
  ariaLabel,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text || "");

  const getRandomChar = useCallback(() => {
    return charset[Math.floor(Math.random() * charset.length)];
  }, [charset]);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      return;
    }

    if (!isAnimating) {
      setDisplayText(text);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    const totalChars = text.length;
    const intervalPerChar = duration / totalChars;
    let resolvedCount = 0;

    const scrambleInterval = setInterval(() => {
      const scrambled = text
        .split("")
        .map((char, i) => {
          if (i < resolvedCount) return char;
          if (char === " ") return " ";
          return getRandomChar();
        })
        .join("");

      setDisplayText(scrambled);
    }, 50);

    const resolveInterval = setInterval(() => {
      resolvedCount++;
      if (resolvedCount >= totalChars) {
        clearInterval(scrambleInterval);
        clearInterval(resolveInterval);
        setDisplayText(text);
      }
    }, intervalPerChar);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(resolveInterval);
    };
  }, [text, isAnimating, duration, getRandomChar]);

  return (
    <span
      className={className}
      role="status"
      aria-label={ariaLabel || text}
      aria-live="polite"
    >
      {displayText}
    </span>
  );
}

const GlitchText = memo(GlitchTextComponent);
export default GlitchText;
