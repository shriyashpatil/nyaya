import React, { useState, useRef, useEffect } from 'react';
import { askQuestion } from '../api/client';

const STATES = ['Maharashtra', 'Gujarat', 'Haryana', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Rajasthan'];

const QUICK_QUESTIONS = [
  'What documents are required for RERA registration?',
  'What is the escrow account requirement?',
  'What are the penalties for late delivery?',
  'How long does RERA registration take?',
];

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I\'m your RERA compliance expert. Select a state below and ask me anything about RERA regulations, penalties, documentation, or compliance requirements.',
    },
  ]);
  const [input, setInput] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (question) => {
    const q = question || input.trim();
    if (!q || loading) return;

    const userMsg = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await askQuestion(q, state);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer || 'Sorry, I could not process your question.' },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ Error: ${err.message}`, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="card flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">💬 RERA Expert Chat</h2>
        <select value={state} onChange={(e) => setState(e.target.value)} className="form-select w-44 text-sm">
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            disabled={loading}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : msg.isError
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about RERA in ${state}... (Enter to send)`}
          rows={2}
          disabled={loading}
          className="flex-1 form-input resize-none text-sm"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary self-end px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
