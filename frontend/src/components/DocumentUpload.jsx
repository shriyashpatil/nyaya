import React, { useState, useRef } from 'react';
import { uploadDocument } from '../api/client';

const STATES = ['Maharashtra', 'Gujarat', 'Haryana', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Rajasthan'];

const SEVERITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !state) { setError('Please select a file and state.'); return; }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadDocument(file, state);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Document RERA Compliance Review</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="text-green-600">
                <p className="text-2xl">✅</p>
                <p className="font-medium mt-1">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <p className="text-4xl">📄</p>
                <p className="font-medium mt-2">Drop your document here</p>
                <p className="text-sm mt-1">PDF, Word, or Image (max 10MB)</p>
              </div>
            )}
          </div>

          {/* State Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select state for rule check...</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading || !file || !state} className="btn-primary flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Reviewing document...
              </>
            ) : '🔍 Review Document'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Results */}
      {result && result.status === 'success' && (
        <div className="space-y-4">
          {/* Severity Badge */}
          <div className={`card border ${SEVERITY_COLORS[result.severity] || SEVERITY_COLORS.LOW}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Compliance Review: {result.fileName}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${SEVERITY_COLORS[result.severity]}`}>
                {result.severity} Risk
              </span>
            </div>
            <p className="text-sm mt-2">{result.summary}</p>
          </div>

          {/* Violations */}
          {result.violations?.length > 0 && (
            <div className="card border-l-4 border-red-400">
              <h4 className="font-semibold text-red-700 mb-2">🚫 Violations Found</h4>
              <ul className="space-y-1">
                {result.violations.map((v, i) => <li key={i} className="text-sm text-gray-700">• {v}</li>)}
              </ul>
            </div>
          )}

          {/* Risks */}
          {result.risks?.length > 0 && (
            <div className="card border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-700 mb-2">⚠️ Risks</h4>
              <ul className="space-y-1">
                {result.risks.map((r, i) => <li key={i} className="text-sm text-gray-700">• {r}</li>)}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="card border-l-4 border-green-400">
              <h4 className="font-semibold text-green-700 mb-2">✅ Recommendations</h4>
              <ul className="space-y-1">
                {result.recommendations.map((r, i) => <li key={i} className="text-sm text-gray-700">• {r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
