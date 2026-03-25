import React, { useState } from 'react';
import { generateChecklist } from '../api/client';

const STATES = ['Maharashtra', 'Gujarat', 'Haryana', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Rajasthan'];
const PROJECT_TYPES = ['Residential', 'Commercial', 'Mixed'];

// ── Markdown-to-JSX renderer ──────────────────────────────────────────────────
// Handles: ## headings, **bold**, bullet lists (- / *), numbered lists, plain text
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listBuffer = [];
  let listType = null; // 'ul' | 'ol'
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    const cls =
      listType === 'ol'
        ? 'list-decimal list-inside space-y-1 text-gray-700 text-sm pl-2'
        : 'list-disc list-inside space-y-1 text-gray-700 text-sm pl-2';
    elements.push(
      <Tag key={key++} className={cls}>
        {listBuffer.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {inlineFormat(item)}
          </li>
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  const inlineFormat = (str) => {
    // Replace **bold** with <strong>
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    );
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Blank line
    if (!trimmed) {
      flushList();
      elements.push(<div key={key++} className="h-2" />);
      return;
    }

    // H1  #
    if (/^#\s/.test(trimmed)) {
      flushList();
      elements.push(
        <h1 key={key++} className="text-xl font-bold text-blue-800 mt-5 mb-2 border-b border-blue-100 pb-1">
          {trimmed.replace(/^#\s+/, '')}
        </h1>
      );
      return;
    }

    // H2  ##
    if (/^##\s/.test(trimmed)) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-base font-bold text-blue-700 mt-5 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
      return;
    }

    // H3  ###
    if (/^###\s/.test(trimmed)) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-sm font-bold text-gray-800 mt-3 mb-1 uppercase tracking-wide">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
      return;
    }

    // Numbered list  1. / 2.
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; }
      listBuffer.push(olMatch[2]);
      return;
    }

    // Bullet list  - / *
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; }
      listBuffer.push(ulMatch[1]);
      return;
    }

    // Bold-only line (acts as a mini heading)
    if (/^\*\*[^*]+\*\*[:\s]*$/.test(trimmed)) {
      flushList();
      elements.push(
        <p key={key++} className="text-sm font-semibold text-gray-800 mt-3 mb-0.5">
          {inlineFormat(trimmed)}
        </p>
      );
      return;
    }

    // Plain paragraph
    flushList();
    elements.push(
      <p key={key++} className="text-sm text-gray-700 leading-relaxed">
        {inlineFormat(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
}
// ─────────────────────────────────────────────────────────────────────────────

function ChecklistForm() {
  const [form, setForm] = useState({ state: '', projectType: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await generateChecklist(form.state, form.projectType, form.location);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.checklist);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Generate RERA Compliance Checklist</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select your state and project details to get an AI-powered compliance checklist.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select name="state" value={form.state} onChange={handleChange} required className="form-select">
                <option value="">Select state...</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
              <select name="projectType" value={form.projectType} onChange={handleChange} required className="form-select">
                <option value="">Select type...</option>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Pune..."
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating checklist…
              </>
            ) : '📋 Generate Checklist'}
          </button>
        </form>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="card animate-pulse space-y-3">
          <div className="h-5 bg-blue-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
          <div className="h-5 bg-blue-100 rounded w-1/4 mt-4" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
          <p className="text-xs text-center text-gray-400 pt-2">Claude is generating your checklist…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
          <span className="text-red-500 text-lg">⚠️</span>
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && result.status === 'success' && (
        <div className="card">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">RERA Compliance Checklist</h3>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {result.state}
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {result.projectType}
                </span>
                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  📍 {result.location}
                </span>
              </div>
            </div>
            <button onClick={handleCopy} className="btn-secondary text-sm flex items-center gap-1.5">
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>

          {/* Rendered checklist */}
          <div className="space-y-1">
            {renderMarkdown(result.checklist)}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              ⚠️ This checklist is AI-generated. Consult a RERA lawyer for legal advice.
            </p>
            <button onClick={handleCopy} className="btn-secondary text-sm flex items-center gap-1.5">
              {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChecklistForm;
