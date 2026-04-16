export default function Home() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#";

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="inline-block bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
          Accessibility Tools
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
          Screen Reader Simulation
          <span className="block text-[#58a6ff]">for Blind Developers</span>
        </h1>
        <p className="text-lg text-[#8b949e] max-w-2xl mx-auto mb-10">
          Test your app&apos;s accessibility without installing screen reader software. Real-time DOM analysis, keyboard navigation simulation, and ARIA validation with audio feedback — all in your browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={checkoutUrl}
            className="inline-block bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Start Free Trial — $15/mo
          </a>
          <a
            href="#faq"
            className="inline-block border border-[#30363d] hover:border-[#58a6ff] text-[#c9d1d9] font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Learn More
          </a>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: "🔊", title: "Audio Feedback", desc: "Hear exactly what a screen reader would announce for any element." },
            { icon: "⌨️", title: "Keyboard Nav Sim", desc: "Simulate Tab, Arrow, and shortcut key navigation flows instantly." },
            { icon: "✅", title: "ARIA Validator", desc: "Catch missing roles, labels, and broken landmark structures in real time." }
          ].map((f) => (
            <div key={f.title} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-[#8b949e] text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Simple Pricing</h2>
        <div className="bg-[#161b22] border-2 border-[#58a6ff] rounded-2xl p-8 text-center shadow-lg shadow-[#58a6ff]/10">
          <span className="inline-block bg-[#58a6ff]/10 text-[#58a6ff] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Pro
          </span>
          <div className="text-5xl font-extrabold text-white mb-1">$15</div>
          <div className="text-[#8b949e] mb-6">per month</div>
          <ul className="text-left space-y-3 mb-8">
            {[
              "Unlimited DOM scans",
              "Audio feedback engine",
              "Keyboard navigation simulator",
              "ARIA attribute validator",
              "Export accessibility reports",
              "Priority support"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[#c9d1d9]">
                <span className="text-[#58a6ff] font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href={checkoutUrl}
            className="block w-full bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold py-4 rounded-lg text-lg transition-colors"
          >
            Get Started
          </a>
          <p className="text-[#8b949e] text-xs mt-4">Cancel anytime. No hidden fees.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-10">FAQ</h2>
        <div className="space-y-6">
          {[
            {
              q: "Do I need to install a real screen reader?",
              a: "No. AccessibilityDevHelper runs entirely in your browser and simulates screen reader behavior using the Web Speech API and DOM inspection — no external software required."
            },
            {
              q: "Which browsers are supported?",
              a: "Chrome, Edge, and Firefox on desktop are fully supported. Audio feedback requires a browser with Web Speech API support (Chrome and Edge recommended)."
            },
            {
              q: "Can I test any website, or only my own?",
              a: "You can test any URL you have access to. For best results on third-party sites, use our browser extension to inject the simulator directly into the page."
            }
          ].map((item) => (
            <div key={item.q} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">{item.q}</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#30363d] text-center py-8 text-[#8b949e] text-sm">
        &copy; {new Date().getFullYear()} AccessibilityDevHelper. All rights reserved.
      </footer>
    </main>
  );
}
