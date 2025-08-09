function Footer() {
  return (
    <footer className="text-center py-6 border-t border-gray-700">
      <p className="text-gray-500 text-sm">
        Fait avec sarcasme et beaucoup de café par{" "}
        <a
          href="https://kevine-dev.link/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:underline"
        >
          DevEnGalère
        </a>
      </p>
      <p className="text-gray-600 text-xs mt-1">
        Ceci n'est pas un conseil juridique. Juste une parodie. Ne signez rien
        sur cette base.
      </p>
    </footer>
  );
}

export default Footer;
