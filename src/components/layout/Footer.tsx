export default function Footer() {
  return (
    <footer className="relative bg-pure-black py-12 px-6 border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-t from-white/[0.01] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/20 text-xs font-medium">
            © Copyright by FocusForge. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {["Privacy Policy", "Terms of Use", "Legal", "Site Map"].map((link) => (
              <a key={link} href="#" className="text-white/20 hover:text-white text-xs font-medium transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
