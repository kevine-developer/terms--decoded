export const parseMarkdown = (text: string): string => {
  if (!text) return "";

  let html = text;

  // Headers (H1-H6)
  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-xl font-bold text-white mt-6 mb-3 border-b border-gray-600 pb-2">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-bold text-white mt-6 mb-4 border-b border-gray-600 pb-2">$1</h2>'
  );
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-bold text-white mt-6 mb-4 border-b border-gray-600 pb-3">$1</h1>'
  );

  // Bold
  html = html.replace(
    /\*\*(.*)\*\*/gim,
    '<strong class="text-white font-semibold">$1</strong>'
  );
  html = html.replace(
    /__(.*?)__/gim,
    '<strong class="text-white font-semibold">$1</strong>'
  );

  // Italic
  html = html.replace(
    /\*((?!\*).+?)\*/gim,
    '<em class="text-blue-300 italic">$1</em>'
  );
  html = html.replace(
    /_((?!_).+?)_/gim,
    '<em class="text-blue-300 italic">$1</em>'
  );

  // Code inline
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="bg-gray-700 text-emerald-300 px-2 py-1 rounded text-sm font-mono">$1</code>'
  );

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/gim,
    '<div class="my-4 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">' +
      '<div class="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono">$1</div>' +
      '<pre class="p-4 overflow-x-auto"><code class="text-green-300 font-mono text-sm leading-relaxed">$2</code></pre>' +
      "</div>"
  );

  // Lists non-ordonnées
  html = html.replace(
    /^\s*[*+-]\s+(.+)$/gim,
    '<li class="ml-6 mb-2 text-gray-300 relative"><span class="absolute -ml-6 text-emerald-400">•</span>$1</li>'
  );

  // Lists ordonnées
  html = html.replace(
    /^\s*(\d+)\.\s+(.+)$/gim,
    '<li class="ml-6 mb-2 text-gray-300 relative counter-item"><span class="absolute -ml-6 text-blue-400 font-semibold">$1.</span>$2</li>'
  );

  // Encapsuler les listes consécutives
  html = html.replace(
    /(<li[^>]*>.*?<\/li>\s*)+/gis,
    '<ul class="my-4 space-y-1">$&</ul>'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" class="text-blue-400 hover:text-blue-300 underline decoration-dotted underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Blockquotes
  html = html.replace(
    /^>\s*(.+)$/gim,
    '<blockquote class="border-l-4 border-emerald-500 pl-4 my-4 italic text-gray-400 bg-gray-800/30 py-2 rounded-r">$1</blockquote>'
  );

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-6 border-gray-600" />');

  // Line breaks et paragraphes
  html = html.replace(
    /\n\n+/g,
    '</p><p class="mb-4 text-gray-300 leading-relaxed">'
  );
  html = '<p class="mb-4 text-gray-300 leading-relaxed">' + html + "</p>";

  // Nettoyer les paragraphes vides
  html = html.replace(/<p[^>]*><\/p>/g, "");
  html = html.replace(/<p[^>]*>\s*<\/p>/g, "");

  // Tables (basic support)
  const tableRegex = /(\|.*\|.*\n)+/gm;
  html = html.replace(tableRegex, (match) => {
    const rows = match.trim().split("\n");
    let tableHtml =
      '<div class="my-4 overflow-x-auto"><table class="min-w-full border border-gray-700 rounded-lg overflow-hidden">';

    rows.forEach((row, index) => {
      if (row.includes("|---") || row.includes("|:-")) return; // Skip separator row

      const cells = row.split("|").filter((cell) => cell.trim() !== "");
      const isHeader = index === 0;
      const tag = isHeader ? "th" : "td";
      const className = isHeader
        ? "px-4 py-3 bg-gray-800 text-white font-semibold border-b border-gray-700"
        : "px-4 py-2 text-gray-300 border-b border-gray-800";

      tableHtml += `<tr>`;
      cells.forEach((cell) => {
        tableHtml += `<${tag} class="${className}">${cell.trim()}</${tag}>`;
      });
      tableHtml += `</tr>`;
    });

    tableHtml += "</table></div>";
    return tableHtml;
  });

  return html;
};
