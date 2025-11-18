import { Link } from "react-router";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-900 to-violet-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 px-6">
        {/* Glitchy 404 */}
        <div className="relative mb-8">
          <h1
            className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-emerald-400 to-pink-400 mb-4 transition-all duration-200 ${
              glitchActive ? "animate-pulse filter blur-sm" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? "2px 0 #ff0000, -2px 0 #00ffff, 0 2px #ffff00"
                : "0 0 20px rgba(147, 51, 234, 0.5)",
            }}
          >
            404
          </h1>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-60"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ERROR 404 : DevEnGalère detected ! 😅
          </h2>
          <p className="text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
            Comme quand tu oublies un point-virgule et que ton code plante...
            Cette page a disparu dans les méandres du serveur !
            <br />
            <span className="text-emerald-300 font-medium">
              Nos avocats-robots débuggent la situation
            </span>
          </p>
        </div>
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group relative px-8 py-4 bg-linear-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="relative z-10 flex items-center gap-2">
              git checkout main
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </Link>

          <button
            onClick={() => window.history.back()}
            className=" cursor-pointer group px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-gray-300 font-semibold rounded-xl border border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="flex items-center gap-2">
              Ctrl+Z dans la vraie vie
            </span>
          </button>
        </div>

        {/* Floating legal joke */}
        <div className="mt-12 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 max-w-lg mx-auto">
          <p className="text-sm text-gray-400 italic">
            💡 <strong>DevEnGalère du jour :</strong> Quand tu cherches une page
            qui existe pas, c'est comme debugger un code qui marche chez moi™
            mais pas en prod...
            <span className="text-emerald-300">C'est un classic ! 😂</span>
          </p>
        </div>
      </div>

      {/* Animated code rain effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {Math.random() > 0.5 ? "01010101" : "10101010"}
          </div>
        ))}
      </div>
    </div>
  );
}
