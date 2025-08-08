interface TextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div>
      <label
        htmlFor="legal-text"
        className="block text-lg font-medium text-gray-300 mb-2"
      >
        Le jargon juridique à décoder
      </label>
      <textarea
        id="legal-text"
        name="legal-text"
        rows={12}
        className="block w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        placeholder="Collez ici les 30 pages que vous avez fait semblant de lire..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default TextInput;
