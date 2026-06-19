import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, BookOpen, PlaySquare, MessageCircle, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { searchIndex } from '../data/searchIndex';

const CATEGORY_ORDER = ['Pages', 'Resources', 'Playlists', 'Community'];
const MAX_RESULTS = 8;

const CATEGORY_ICONS = {
  Pages: Globe,
  Resources: BookOpen,
  Playlists: PlaySquare,
  Community: MessageCircle,
};

function highlight(text, query) {
  if (!query || typeof text !== 'string') return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: 'var(--accent)' }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

function buildOrdered(staticRes, dynamic) {
  const all = [...staticRes, ...dynamic];
  const ordered = CATEGORY_ORDER.flatMap(cat => all.filter(r => r.category === cat));
  const seen = new Set();
  return ordered
    .filter(r => {
      const key = `${r.category}:${r.path}:${r.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_RESULTS);
}

export default function SearchBar({ className = '', placeholder = 'Search pages, resources…' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // close and reset on route change
  useEffect(() => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setActiveIdx(-1);
  }, [pathname]);

  // close on outside click
  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const q = query.trim().toLowerCase();

    // immediate static results
    const staticRes = searchIndex.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
    setResults(buildOrdered(staticRes, []));
    setOpen(true);
    setActiveIdx(-1);

    // debounced Supabase search
    let cancelled = false;

    const timerId = setTimeout(async () => {
      setLoading(true);
      try {
        const [resourcesRes, playlistsRes, questionsRes] = await Promise.all([
          supabase
            .from('resources')
            .select('id, subject_name')
            .ilike('subject_name', `%${query.trim()}%`)
            .limit(4),
          supabase
            .from('playlists')
            .select('id, subject, channel_name')
            .ilike('subject', `%${query.trim()}%`)
            .limit(4),
          supabase
            .from('questions')
            .select('id, question_text')
            .ilike('question_text', `%${query.trim()}%`)
            .limit(4),
        ]);

        if (cancelled) return;

        const dynamic = [];

        if (!resourcesRes.error && resourcesRes.data) {
          resourcesRes.data.forEach(r => {
            dynamic.push({
              title: r.subject_name,
              description: '',
              path: '/resources',
              category: 'Resources',
            });
          });
        }

        if (!playlistsRes.error && playlistsRes.data) {
          playlistsRes.data.forEach(p => {
            dynamic.push({
              title: p.subject,
              description: p.channel_name || '',
              path: '/youtube',
              category: 'Playlists',
            });
          });
        }

        if (!questionsRes.error && questionsRes.data) {
          questionsRes.data.forEach(q => {
            dynamic.push({
              title: q.question_text,
              description: '',
              path: '/community',
              category: 'Community',
            });
          });
        }

        if (!cancelled) {
          setResults(buildOrdered(staticRes, dynamic));
        }
      } catch {
        // static results remain visible
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [query]);

  function selectResult(result) {
    navigate(result.path);
    setQuery('');
    setOpen(false);
    setResults([]);
  }

  function clear() {
    setQuery('');
    setOpen(false);
    setResults([]);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        selectResult(results[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  // group for display; track flat position for keyboard nav
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = results.filter(r => r.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  let flatCounter = 0;
  const itemFlatIdx = new Map();
  CATEGORY_ORDER.forEach(cat => {
    (grouped[cat] || []).forEach(item => {
      itemFlatIdx.set(item, flatCounter++);
    });
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* input */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (query.trim() && results.length) setOpen(true); }}
          placeholder={placeholder}
          aria-label="Search"
          aria-expanded={open}
          aria-haspopup="listbox"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'var(--surface)',
            color: 'var(--text)',
            borderColor: 'var(--border)',
          }}
          className="w-full pl-9 pr-8 py-2 text-sm rounded-[0.625rem] border
                     focus:outline-none focus:border-[var(--accent)]
                     placeholder:text-[var(--text-muted)]
                     transition-colors duration-150"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded
                       transition-opacity duration-100 hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Search results"
          className="glass absolute top-full left-0 right-0 mt-1.5 z-[60] rounded-xl
                     overflow-hidden shadow-2xl"
        >
          {results.length === 0 && !loading && (
            <p
              className="px-4 py-5 text-sm text-center"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
            >
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {Object.entries(grouped).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category];
            return (
              <div key={category}>
                <p
                  className="px-3 pt-2.5 pb-1 text-[0.6rem] uppercase tracking-[0.1em] font-bold"
                  style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                >
                  {category}
                </p>
                {items.map(item => {
                  const idx = itemFlatIdx.get(item);
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={`${item.category}-${item.path}-${item.title}`}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => selectResult(item)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className="w-full text-left px-3 py-2 flex items-center gap-2.5
                                 transition-colors duration-100 outline-none"
                      style={{
                        background: isActive ? 'var(--surface2)' : 'transparent',
                      }}
                    >
                      <Icon
                        size={13}
                        className="shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                      />
                      <span
                        className="flex-1 text-sm truncate"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}
                      >
                        {highlight(item.title, query)}
                      </span>
                      <span
                        className="shrink-0 text-[0.58rem] uppercase tracking-wider
                                   px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: 'var(--font-ui)',
                          background: 'var(--surface2)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {item.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {loading && (
            <p
              className="px-3 py-2 text-[0.72rem]"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
            >
              Searching…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
