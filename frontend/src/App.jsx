import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ChecklistForm from './components/ChecklistForm';
import DocumentUpload from './components/DocumentUpload';
import ChatBot from './components/ChatBot';

const TABS = [
  { id: 'checklist', label: '📋 Checklist' },
  { id: 'document',  label: '📄 Review Doc' },
  { id: 'chat',      label: '💬 Ask Expert' },
];

function AppShell() {
  const [activeTab, setActiveTab] = useState('checklist');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <div>
              <span className="text-lg font-bold text-blue-700">Nyaya</span>
              <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">MVP</span>
            </div>
          </div>

          {/* Tab nav inside header on larger screens */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400 hidden md:block">RERA Compliance Tool</span>
        </div>

        {/* Mobile tab nav */}
        <div className="flex sm:hidden border-t border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'checklist' && <ChecklistForm />}
        {activeTab === 'document'  && <DocumentUpload />}
        {activeTab === 'chat'      && <ChatBot />}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100 mt-4">
        Nyaya MVP — RERA compliance powered by Claude AI. Not a substitute for legal advice.
      </footer>
    </div>
  );
}

function App() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  return <AppShell />;
}

export default App;
