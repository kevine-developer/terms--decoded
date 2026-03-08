import { memo } from "react";

interface ctaProps {
  link: string;
  title: string;
}

/**
 * Cta — Call to action box styled as a "Notice" in Brutalist Editorial.
 * Uses lavender and slate colors to remain visible but secondary.
 */
function CtaComponent({ link, title }: ctaProps) {
  return (
    <div
      className=" p-2 border transition-all duration-300"
      style={{
        background: "var(--color-graphite)",
        borderColor: "var(--color-slate)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <p className="text-xs font-mono text-center flex flex-col md:flex-row items-center justify-center gap-2">
        <span style={{ color: "var(--color-off-white)" }}>
          <strong style={{ color: "var(--color-acid-lime)" }}>Hey !</strong>{" "}
          Envie d'en savoir plus sur moi et mes projets ?
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline underline-offset-4 transition-colors duration-300"
          style={{ color: "var(--color-lavender)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-acid-lime)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-lavender)")
          }
          aria-label={`${title} (ouvre un nouvel onglet)`}
        >
          {title}
        </a>
      </p>
    </div>
  );
}

const Cta = memo(CtaComponent);
export default Cta;
