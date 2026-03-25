import React from 'react';

const FEATURES = [
  {
    icon: '📋',
    title: 'Compliance Checklist',
    desc: 'Generate a state-specific, AI-powered RERA checklist for your project in seconds — covering registration, disclosures, timelines, and penalties.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '📄',
    title: 'Document Review',
    desc: 'Upload a sale agreement, brochure, or project report and get an instant compliance audit: violations, risks, and corrective recommendations.',
    color: 'bg-emerald-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: '💬',
    title: 'RERA Expert Chat',
    desc: 'Ask anything about RERA — escrow rules, penalty calculations, possession timelines, or allottee rights — and get accurate, cited answers.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
];

const STATS = [
  { value: '15+', label: 'RERA Rules Covered' },
  { value: '7', label: 'States Supported' },
  { value: '3', label: 'AI-Powered Tools' },
  { value: '100%', label: 'Free to Use' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Select Your State', desc: 'Pick the state where your project is located. Rules are specific to each state RERA authority.' },
  { step: '02', title: 'Describe Your Project', desc: 'Enter project type (Residential, Commercial, Mixed) and location for a tailored compliance report.' },
  { step: '03', title: 'Get AI-Powered Guidance', desc: 'Claude AI cross-references your details against the relevant RERA rules and generates actionable output.' },
];

const STATES_SUPPORTED = ['Maharashtra', 'Gujarat', 'Haryana', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Rajasthan'];

function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <div>
              <span className="text-xl font-bold text-blue-700">Nyaya</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">MVP</span>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="btn-primary text-sm px-5 py-2"
          >
            Launch App →
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-sm mb-6 backdrop-blur">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Powered by Claude AI · India's RERA Compliance Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            RERA Compliance,<br />
            <span className="text-yellow-300">Simplified.</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Nyaya helps real estate developers, legal teams, and homebuyers navigate India's RERA
            regulations — generate checklists, review documents, and get instant expert answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
            >
              Get Started Free →
            </button>
            <a
              href="#features"
              className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              See Features ↓
            </a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="overflow-hidden -mb-px">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center bg-blue-50 rounded-2xl py-6 px-4 border border-blue-100">
              <div className="text-3xl font-extrabold text-blue-700">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need for RERA compliance</h2>
          <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
            Three AI-powered tools that cover the entire RERA compliance lifecycle for real estate projects.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className={`rounded-2xl border p-6 ${f.color} flex flex-col gap-4`}>
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
              <button
                onClick={onGetStarted}
                className="mt-auto text-sm font-semibold text-blue-600 hover:text-blue-800 text-left"
              >
                Try it now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-3">Get your compliance checklist in under 60 seconds.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block w-px h-full bg-blue-200 mx-auto mt-2" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── States Supported ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">States Supported</h2>
        <p className="text-gray-500 text-sm mb-6">More states being added with each release.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {STATES_SUPPORTED.map((s) => (
            <span key={s} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              {s}
            </span>
          ))}
          <span className="bg-white border border-dashed border-gray-300 text-gray-400 px-4 py-2 rounded-full text-sm">
            + More coming soon
          </span>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to stay RERA compliant?</h2>
          <p className="text-blue-100 mb-8 text-base">
            Start using Nyaya today — free, fast, and powered by Claude AI.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
          >
            Launch the App →
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-white">Nyaya</span>
            <span className="text-xs ml-1">RERA Compliance Tool</span>
          </div>
          <p className="text-xs text-center">
            AI-generated content is for informational purposes only. Not a substitute for legal advice.
          </p>
          <p className="text-xs">MVP v1.0 · Built with Claude AI</p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
