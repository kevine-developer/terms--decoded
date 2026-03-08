import { useState, useEffect, memo } from "react";
import { ShieldCheck } from "lucide-react";

interface StampAnimationProps {
  /** Whether to show the stamp */
  visible: boolean;
  /** Text content of the stamp */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StampAnimation — A "DÉCODÉ" stamp that slams onto the result area.
 * Uses CSS @keyframes for the slam effect.
 * Hidden from screen readers as it's purely decorative.
 */
function StampAnimationComponent({
  visible,
  label = "DÉCODÉ",
  className = "",
}: StampAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <div
        className="font-display font-bold text-3xl md:text-5xl uppercase tracking-widest border-4 px-6 py-3 md:px-10 md:py-5 select-none flex items-center gap-3"
        style={{
          color: "var(--color-coral)",
          borderColor: "var(--color-coral)",
          animation: "stamp-slam 800ms ease-out forwards",
          transform: "rotate(-12deg)",
        }}
      >
        {label}
        <ShieldCheck className="w-8 h-8 md:w-12 md:h-12" />
      </div>
    </div>
  );
}

const StampAnimation = memo(StampAnimationComponent);
export default StampAnimation;
