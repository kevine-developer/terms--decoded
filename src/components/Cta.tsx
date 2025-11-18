interface ctaProps {
  link: string;
  title: string;
}

function Cta({ link, title }: ctaProps) {
  return (
    <div className="mb-2 p-3 bg-linear-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-lg backdrop-blur-sm">
      <p className="text-sm  text-emerald-200 flex  flex-col md:flex-row items-center text-center gap-2">
        <span>
          <strong>Hey&nbsp;!</strong> Envie d&apos;en savoir plus sur moi et mes
          projets&nbsp;?
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-400"
          aria-label="Découvrir mon profil, s'ouvre dans un nouvel onglet"
        >
          {title}
        </a>
      </p>
    </div>
  );
}

export default Cta;
