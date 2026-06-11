import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from '../lib/supabase';
import {
  Search, AlertTriangle, ChevronDown, X,
  BookmarkPlus, BookmarkCheck, Info, MapPin, Building2
} from "lucide-react";

// ─── constants ──────────────────────────────────────────────────────────────

const BRANCH_PATTERNS = {
  CS:    ["computer engineering", "computer science"],
  IT:    ["information technology"],
  Mech:  ["mechanical"],
  Civil: ["civil"],
  Elec:  ["electrical"],
  ETC:   ["electronics"],
  AIDS:  ["artificial intelligence and data science"],
  AIML:  ["artificial intelligence and machine learning"],
  Robo:  ["robotics"],
  DS:    ["data science"],
};

const BRANCH_LABELS = {
  CS: "Computer Science", IT: "Information Technology",
  Mech: "Mechanical",     Civil: "Civil",
  Elec: "Electrical",     ETC: "Electronics & TC",
  AIDS: "AI & Data Science", AIML: "AI & Machine Learning",
  Robo: "Robotics & Automation", DS: "Data Science",
};

const BRANCHES = Object.keys(BRANCH_PATTERNS);

const CATEGORIES = [
  { value: "GOPEN",  label: "Open (General)" },
  { value: "LOPEN",  label: "Open (Ladies)" },
  { value: "GOBC",   label: "OBC (General)" },
  { value: "LOBC",   label: "OBC (Ladies)" },
  { value: "GSC",    label: "SC (General)" },
  { value: "LSC",    label: "SC (Ladies)" },
  { value: "GST",    label: "ST (General)" },
  { value: "LST",    label: "ST (Ladies)" },
  { value: "GNTA",   label: "VJ / NT-A (General)" },
  { value: "LNTA",   label: "VJ / NT-A (Ladies)" },
  { value: "GNTB",   label: "NT-B (General)" },
  { value: "LNTB",   label: "NT-B (Ladies)" },
  { value: "GNTC",   label: "NT-C (General)" },
  { value: "LNTC",   label: "NT-C (Ladies)" },
  { value: "GNTD",   label: "NT-D (General)" },
  { value: "LNTD",   label: "NT-D (Ladies)" },
  { value: "GSEBC",  label: "SEBC (General)" },
  { value: "LSEBC",  label: "SEBC (Ladies)" },
  { value: "EWS",    label: "EWS" },
];

// All distinct districts that can appear in the data
const DISTRICTS = [
  "Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana",
  "Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna",
  "Kolhapur","Latur","Mumbai","Mumbai Suburban","Nagpur","Nanded","Nandurbar",
  "Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri",
  "Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal",
];

const PCT_MARGIN = 1.5;

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Dropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3
                    rounded-lg border bg-[#141414] font-['General_Sans'] text-sm
                    transition-colors duration-150
                    ${value ? "border-[#2a2a2a] text-[#f0ede6]" : "border-[#2a2a2a] text-[#888]"}
                    hover:border-[#888]`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} strokeWidth={2}
          className={`text-[#888] transition-transform duration-150 shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-full border border-[#2a2a2a]
                          rounded-lg bg-[#141414] shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 font-['General_Sans'] text-sm
                            hover:bg-[#1a1a1a] transition-colors duration-100
                            ${value === opt.value ? "text-[#e8453c]" : "text-[#f0ede6]"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BranchSelect({ selected, onChange }) {
  const toggle = (b) => onChange(
    selected.includes(b) ? selected.filter((x) => x !== b) : [...selected, b]
  );
  return (
    <div className="flex flex-wrap gap-2">
      {BRANCHES.map((b) => (
        <button key={b} onClick={() => toggle(b)}
          className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border
                      transition-colors duration-150
                      ${selected.includes(b)
                        ? "border-[#e8453c] bg-[#e8453c]/5"
                        : "border-[#2a2a2a] bg-transparent hover:border-[#888] hover:bg-[#141414]"}`}>
          <span className={`font-['JetBrains_Mono'] text-[0.75rem] font-bold tracking-wider
                            ${selected.includes(b) ? "text-[#e8453c]" : "text-[#f0ede6]"}`}>
            {b}
          </span>
          <span className="font-['General_Sans'] text-[0.63rem] text-[#888] whitespace-nowrap hidden sm:block">
            {BRANCH_LABELS[b]}
          </span>
        </button>
      ))}
    </div>
  );
}

function ChanceBadge({ chance }) {
  const styles = {
    high:  "border-[#e8453c]/40 text-[#e8453c] bg-[#e8453c]/10",
    good:  "border-[#e8453c]/25 text-[#e8453c] bg-[#e8453c]/5",
    reach: "border-[#2a2a2a] text-[#888] bg-[#1a1a1a]",
  };
  const labels = { high: "High Chance", good: "Good Chance", reach: "Reach" };
  return (
    <span className={`font-['JetBrains_Mono'] text-[0.63rem] uppercase tracking-wider
                       border px-2 py-0.5 rounded ${styles[chance]}`}>
      {labels[chance]}
    </span>
  );
}

// ─── college search autocomplete ─────────────────────────────────────────────

function CollegeSearch({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (value.length < 2) { setSuggestions([]); setOpen(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("cutoffs")
        .select("college_code, college_name, district")
        .ilike("college_name", `%${value}%`)
        .eq("year", 2025)
        .order("college_name")
        .limit(8);
      // deduplicate by college_code
      const seen = new Set();
      const unique = (data || []).filter((r) => {
        if (seen.has(r.college_code)) return false;
        seen.add(r.college_code); return true;
      });
      setSuggestions(unique);
      setOpen(unique.length > 0);
      setLoading(false);
    }, 300);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <Building2 size={14} strokeWidth={2}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
        <input
          type="text"
          placeholder="Search college name…"
          value={value}
          onChange={(e) => { onChange(e.target.value); if (!e.target.value) onSelect(null); }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          className="w-full pl-9 pr-10 py-3 rounded-lg border border-[#2a2a2a] bg-[#141414]
                     font-['General_Sans'] text-sm text-[#f0ede6] placeholder:text-[#888]
                     hover:border-[#888] focus:border-[#e8453c] focus:outline-none
                     transition-colors duration-150"
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2
                          w-3.5 h-3.5 border-2 border-[#e8453c] border-t-transparent
                          rounded-full animate-spin" />
        )}
        {value && !loading && (
          <button onClick={() => { onChange(""); onSelect(null); setSuggestions([]); setOpen(false); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#f0ede6]">
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 w-full border border-[#2a2a2a]
                          rounded-lg bg-[#141414] shadow-2xl overflow-hidden">
            {suggestions.map((s) => (
              <button key={s.college_code}
                onClick={() => { onChange(s.college_name); onSelect(s); setOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-[#1a1a1a] transition-colors duration-100
                           border-b border-[#1a1a1a] last:border-0">
                <p className="font-['General_Sans'] text-sm text-[#f0ede6] leading-snug">{s.college_name}</p>
                <p className="font-['JetBrains_Mono'] text-[0.6rem] text-[#888] mt-0.5 flex items-center gap-1">
                  <MapPin size={9} strokeWidth={2} />{s.district} · {s.college_code}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── result card ─────────────────────────────────────────────────────────────

function ResultCard({ college, isShortlisted, onToggle }) {
  return (
    <div className={`rounded-lg border bg-[#141414] p-5 transition-colors duration-150
                     ${isShortlisted ? "border-[#e8453c]/50" : "border-[#2a2a2a] hover:border-[#e8453c]/30"}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-['JetBrains_Mono'] text-[0.65rem] text-[#888] tracking-wider uppercase mb-1">
            {college.college_code} · {college.district}
          </p>
          <p className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-[0.92rem] leading-snug">
            {college.college_name}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-['JetBrains_Mono'] text-[1.35rem] font-bold text-[#e8453c] leading-none">
            {college.cutoff_percent.toFixed(2)}
            <span className="text-[0.65rem] text-[#888] font-normal ml-0.5">%</span>
          </p>
          <p className="font-['General_Sans'] text-[0.63rem] text-[#888] mt-0.5">
            2025 CAP {college.cap_round} cutoff
          </p>
        </div>
      </div>

      <p className="font-['General_Sans'] text-[0.78rem] text-[#888] mb-3 leading-snug">
        {college.course_name}
        {college.cutoff_open != null && (
          <span className="text-[#888]/70"> · merit rank ~{college.cutoff_open.toLocaleString("en-IN")}</span>
        )}
      </p>

      <div className="flex items-center justify-between gap-3 mb-3">
        {college.chance && <ChanceBadge chance={college.chance} />}
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2a2a2a]">
        <div className="flex flex-wrap gap-1.5">
          <span className="font-['JetBrains_Mono'] text-[0.63rem] text-[#888]
                           bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded">
            {college.category}
          </span>
          <span className="font-['JetBrains_Mono'] text-[0.63rem] text-[#888]
                           bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded">
            CAP {college.cap_round}
          </span>
        </div>
        <button onClick={() => onToggle(college)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md
                      font-['General_Sans'] text-[0.75rem] font-medium border
                      transition-colors duration-150
                      ${isShortlisted
                        ? "border-[#e8453c]/40 text-[#e8453c] bg-[#e8453c]/5 hover:bg-[#e8453c]/10"
                        : "border-[#2a2a2a] text-[#888] hover:border-[#888] hover:text-[#f0ede6]"}`}>
          {isShortlisted
            ? <><BookmarkCheck size={13} strokeWidth={2} /> Shortlisted</>
            : <><BookmarkPlus size={13} strokeWidth={2} /> Shortlist</>}
        </button>
      </div>
    </div>
  );
}

// ─── college search results (all branches for one college) ───────────────────

function CollegeAllBranches({ college, category, onClose }) {
  const [rows, setRows]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("cutoffs")
        .select("course_name, category, cap_round, cutoff_open, cutoff_percent")
        .eq("college_code", college.college_code)
        .eq("year", 2025)
        .eq("category", category)
        .order("cutoff_percent", { ascending: false });
      setRows(data || []);
      setLoading(false);
    }
    load();
  }, [college.college_code, category]);

  return (
    <div className="rounded-xl border border-[#e8453c]/30 bg-[#141414] overflow-hidden">
      {/* header */}
      <div className="flex items-start justify-between gap-4 p-5 border-b border-[#2a2a2a]">
        <div>
          <p className="font-['JetBrains_Mono'] text-[0.65rem] text-[#888] tracking-wider uppercase mb-1">
            {college.college_code} · {college.district} · 2025 cutoffs · {category}
          </p>
          <p className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-base leading-snug">
            {college.college_name}
          </p>
        </div>
        <button onClick={onClose} className="shrink-0 text-[#888] hover:text-[#f0ede6] mt-0.5">
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-10">
          <div className="w-4 h-4 border-2 border-[#e8453c] border-t-transparent rounded-full animate-spin" />
          <span className="font-['General_Sans'] text-[#888] text-sm">Loading…</span>
        </div>
      )}

      {!loading && rows.length === 0 && (
        <div className="py-10 text-center">
          <p className="font-['General_Sans'] text-[#888] text-sm">
            No 2025 data for {category} in this college.
          </p>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="divide-y divide-[#1a1a1a]">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5
                                    hover:bg-[#1a1a1a] transition-colors duration-100">
              <div className="min-w-0">
                <p className="font-['General_Sans'] text-sm text-[#f0ede6] leading-snug truncate">
                  {r.course_name}
                </p>
                <p className="font-['JetBrains_Mono'] text-[0.6rem] text-[#888] mt-0.5">
                  CAP {r.cap_round}
                  {r.cutoff_open != null && ` · rank ~${r.cutoff_open.toLocaleString("en-IN")}`}
                </p>
              </div>
              <span className="shrink-0 font-['JetBrains_Mono'] text-lg font-bold text-[#e8453c] leading-none">
                {r.cutoff_percent.toFixed(2)}
                <span className="text-[0.6rem] text-[#888] font-normal">%</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── shortlist panel ──────────────────────────────────────────────────────────

function ShortlistPanel({ shortlist, onRemove, onClear }) {
  if (shortlist.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-30 w-80 border border-[#e8453c]/30
                    rounded-xl bg-[#0d0e0f] shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <BookmarkCheck size={14} strokeWidth={2} className="text-[#e8453c]" />
          <span className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-sm">My Shortlist</span>
          <span className="font-['JetBrains_Mono'] text-[0.65rem] text-[#e8453c] bg-[#e8453c]/10 px-1.5 py-0.5 rounded">
            {shortlist.length}
          </span>
        </div>
        <button onClick={onClear}
          className="font-['General_Sans'] text-[0.72rem] text-[#888] hover:text-[#e8453c] transition-colors duration-150">
          Clear all
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {shortlist.map((c, i) => (
          <div key={c.college_code + c.course_name + i}
            className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-['JetBrains_Mono'] text-[0.6rem] text-[#888]">#{i + 1}</span>
                <span className="font-['JetBrains_Mono'] text-[0.6rem] text-[#888]">{c.college_code}</span>
                <span className="font-['JetBrains_Mono'] text-[0.6rem] text-[#e8453c]">{c.cutoff_percent.toFixed(2)}%</span>
              </div>
              <p className="font-['General_Sans'] text-[0.78rem] text-[#f0ede6] truncate leading-snug">{c.college_name}</p>
              <p className="font-['General_Sans'] text-[0.68rem] text-[#888] truncate">{c.course_name} · {c.district}</p>
            </div>
            <button onClick={() => onRemove(c)} className="shrink-0 text-[#888] hover:text-[#e8453c] transition-colors duration-150">
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-[#2a2a2a]">
        <p className="font-['General_Sans'] text-[0.68rem] text-[#888] leading-relaxed">
          Use this order when filling your DTE option form.
        </p>
      </div>
    </div>
  );
}

// ─── active filter pill ───────────────────────────────────────────────────────

function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                     border border-[#e8453c]/30 bg-[#e8453c]/5
                     font-['General_Sans'] text-[0.72rem] text-[#e8453c]">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors duration-100">
        <X size={11} strokeWidth={2.5} />
      </button>
    </span>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Predictor() {
  // — predictor mode inputs
  const [percentage, setPercentage] = useState("");
  const [branches, setBranches]     = useState([]);
  const [category, setCategory]     = useState("");

  // — shared filters
  const [districtFilter, setDistrictFilter] = useState("");

  // — college search mode
  const [collegeSearchText, setCollegeSearchText] = useState("");
  const [selectedCollege, setSelectedCollege]     = useState(null);

  // — mode: "predictor" | "college"
  const [mode, setMode] = useState("predictor");

  // — results state
  const [searched, setSearched]   = useState(false);
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [shortlist, setShortlist] = useState([]);

  const percentageNum = parseFloat(percentage);
  const isValidPct = percentage !== "" && !isNaN(percentageNum) && percentageNum >= 0 && percentageNum <= 100;
  const canSearch = mode === "predictor"
    ? (isValidPct && branches.length > 0 && category)
    : (selectedCollege !== null && category);

  // ── shortlist handlers ──
  const isShortlisted = useCallback(
    (c) => shortlist.some((s) => s.college_code === c.college_code && s.course_name === c.course_name),
    [shortlist]
  );
  const toggleShortlist = useCallback((c) => {
    setShortlist((prev) =>
      prev.some((s) => s.college_code === c.college_code && s.course_name === c.course_name)
        ? prev.filter((s) => !(s.college_code === c.college_code && s.course_name === c.course_name))
        : [...prev, c]
    );
  }, []);

  // ── predictor search ──
  async function handleSearch() {
    if (!canSearch) return;
    setSearched(true);
    setLoading(true);
    setError(null);
    setResults([]);

    if (mode === "college") {
      // CollegeAllBranches handles its own fetch — just mark as searched
      setLoading(false);
      return;
    }

    const patterns  = branches.flatMap((b) => BRANCH_PATTERNS[b]);
    const orFilter  = patterns.map((p) => `course_name.ilike.%${p}%`).join(",");
    const maxCutoff = percentageNum + PCT_MARGIN;

    let query = supabase
      .from("cutoffs")
      .select("college_code, college_name, district, course_name, category, cap_round, year, cutoff_open, cutoff_percent")
      .eq("category", category)
      .or(orFilter)
      .eq("year", 2025)
      .lte("cutoff_percent", maxCutoff)
      .order("cutoff_percent", { ascending: false });

    if (districtFilter) query = query.eq("district", districtFilter);

    const { data, error: err } = await query;
    if (err) { setError("Could not fetch cutoff data. Please try again."); setLoading(false); return; }

    // Deduplicate: per college+course keep the highest cap_round (Round II > Round I)
    const groups = new Map();
    for (const row of data || []) {
      const key = `${row.college_code}__${row.course_name}`;
      const existing = groups.get(key);
      if (!existing || row.cap_round > existing.cap_round) groups.set(key, row);
    }

    const transformed = [];
    for (const row of groups.values()) {
      let chance;
      if (percentageNum >= row.cutoff_percent + 2)  chance = "high";
      else if (percentageNum >= row.cutoff_percent)  chance = "good";
      else                                           chance = "reach";

      transformed.push({ ...row, chance });
    }

    transformed.sort((a, b) => b.cutoff_percent - a.cutoff_percent);
    setResults(transformed);
    setLoading(false);
  }

  // when mode switches, reset results
  function switchMode(m) {
    setMode(m);
    setSearched(false);
    setResults([]);
    setError(null);
  }

  const activeFilters = [];
  if (districtFilter) activeFilters.push({ label: districtFilter, clear: () => setDistrictFilter("") });

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 pb-32">

      {/* header */}
      <div className="mb-10">
        <p className="font-['JetBrains_Mono'] text-[0.7rem] uppercase tracking-[0.12em] text-[#e8453c] mb-3">
          DTE Maharashtra · 2025-26
        </p>
        <h1 className="font-['Clash_Display'] font-semibold text-[#f0ede6]
                       leading-[1.08] text-[clamp(2rem,5vw,3.25rem)] mb-3">
          College Predictor
        </h1>
        <p className="font-['General_Sans'] text-[#888] text-base max-w-[520px] leading-relaxed">
          Enter your diploma percentage and category to find colleges where you'd
          have cleared the 2025 CAP cutoff — or search a specific college to see
          all its branch cutoffs.
        </p>
      </div>

      {/* disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-[#e8453c]/20 bg-[#e8453c]/5 mb-8">
        <AlertTriangle size={15} strokeWidth={2} className="text-[#e8453c] shrink-0 mt-0.5" />
        <p className="font-['General_Sans'] text-[0.8rem] text-[#888] leading-relaxed">
          Based on actual 2025-26 DTE DSE CAP cutoff percentages — not a live prediction or a guarantee.
          Cutoffs shift every year. Confirm everything on the official DTE Maharashtra CAP portal before
          filling your option form.
        </p>
      </div>

      {/* mode tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[#141414] border border-[#2a2a2a] w-fit mb-8">
        {[
          { id: "predictor", icon: Search,    label: "Predictor" },
          { id: "college",   icon: Building2, label: "Search College" },
        ].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => switchMode(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-['General_Sans'] text-sm
                        font-medium transition-all duration-150
                        ${mode === id
                          ? "bg-[#e8453c] text-white"
                          : "text-[#888] hover:text-[#f0ede6]"}`}>
            <Icon size={14} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {/* ── PREDICTOR MODE form ── */}
      {mode === "predictor" && (
        <div className="flex flex-col gap-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* percentage */}
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[0.68rem] uppercase tracking-wider text-[#888]">
                Your Diploma Percentage
              </label>
              <input
                type="number" min="0" max="100" step="0.01" placeholder="e.g. 78.50"
                value={percentage} onChange={(e) => setPercentage(e.target.value)}
                className="px-4 py-3 rounded-lg border border-[#2a2a2a] bg-[#141414]
                           font-['General_Sans'] text-sm text-[#f0ede6] placeholder:text-[#888]
                           hover:border-[#888] focus:border-[#e8453c] focus:outline-none
                           transition-colors duration-150
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              {percentage && !isValidPct && (
                <p className="font-['General_Sans'] text-[0.72rem] text-[#e8453c]">Enter a value between 0 and 100</p>
              )}
            </div>

            {/* category */}
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[0.68rem] uppercase tracking-wider text-[#888]">
                Category
              </label>
              <Dropdown value={category} onChange={setCategory}
                placeholder="Select your category" options={CATEGORIES} />
            </div>
          </div>

          {/* branch multi-select */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="font-['JetBrains_Mono'] text-[0.68rem] uppercase tracking-wider text-[#888]">
                Preferred Branches
              </label>
              <span className="font-['General_Sans'] text-[0.68rem] text-[#888] opacity-60">— pick one or more</span>
            </div>
            <BranchSelect selected={branches} onChange={setBranches} />
            {branches.length === 0 && (
              <p className="font-['General_Sans'] text-[0.72rem] text-[#888] opacity-60">Select at least one branch</p>
            )}
          </div>

          {/* district filter */}
          <div className="flex flex-col gap-2">
            <label className="font-['JetBrains_Mono'] text-[0.68rem] uppercase tracking-wider text-[#888]">
              Filter by District <span className="opacity-50 normal-case font-['General_Sans'] tracking-normal">— optional</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="w-64">
                <Dropdown
                  value={districtFilter}
                  onChange={setDistrictFilter}
                  placeholder="All districts"
                  options={[{ value: "", label: "All districts" }, ...DISTRICTS.map((d) => ({ value: d, label: d }))]}
                />
              </div>
              {districtFilter && (
                <button onClick={() => setDistrictFilter("")}
                  className="flex items-center gap-1 font-['General_Sans'] text-[0.75rem] text-[#888] hover:text-[#e8453c] transition-colors duration-150">
                  <X size={12} strokeWidth={2} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── COLLEGE SEARCH MODE form ── */}
      {mode === "college" && (
        <div className="flex flex-col gap-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[0.68rem] uppercase tracking-wider text-[#888]">
                College Name
              </label>
              <CollegeSearch
                value={collegeSearchText}
                onChange={setCollegeSearchText}
                onSelect={(c) => { setSelectedCollege(c); setSearched(false); setResults([]); }}
              />
              {selectedCollege && (
                <p className="font-['General_Sans'] text-[0.72rem] text-[#e8453c] flex items-center gap-1">
                  <MapPin size={10} strokeWidth={2} /> {selectedCollege.district}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-['JetBrains_Mono'] text-[0.68rem] uppercase tracking-wider text-[#888]">
                Your Category
              </label>
              <Dropdown value={category} onChange={setCategory}
                placeholder="Select your category" options={CATEGORIES} />
            </div>
          </div>
        </div>
      )}

      {/* active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f) => (
            <FilterPill key={f.label} label={f.label} onRemove={f.clear} />
          ))}
        </div>
      )}

      {/* search button */}
      <button
        onClick={handleSearch}
        disabled={!canSearch}
        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-['Cabinet_Grotesk']
                    font-semibold text-sm transition-all duration-150 mb-12
                    ${canSearch
                      ? "bg-[#e8453c] text-white hover:bg-[#d03d35] cursor-pointer"
                      : "bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] cursor-not-allowed"}`}>
        <Search size={15} strokeWidth={2} />
        {mode === "predictor" ? "Find Colleges" : "Show All Branches"}
      </button>

      {/* ── results ── */}
      <div>
        {loading && (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-5 h-5 border-2 border-[#e8453c] border-t-transparent rounded-full animate-spin" />
            <p className="font-['General_Sans'] text-[#888] text-sm">Searching cutoff data…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <p className="font-['General_Sans'] text-[#e8453c] text-sm">{error}</p>
          </div>
        )}

        {/* college search result — show CollegeAllBranches inline */}
        {mode === "college" && searched && !loading && selectedCollege && category && (
          <CollegeAllBranches
            college={selectedCollege}
            category={category}
            onClose={() => { setSearched(false); setResults([]); }}
          />
        )}

        {/* predictor empty state */}
        {!searched && !loading && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="w-12 h-12 rounded-full border border-[#2a2a2a] flex items-center justify-center mb-2">
              <Search size={20} strokeWidth={1.5} className="text-[#888]" />
            </div>
            <p className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-base">
              {mode === "predictor" ? "Ready when you are" : "Search for a college above"}
            </p>
            <p className="font-['General_Sans'] text-[#888] text-sm max-w-[320px] leading-relaxed">
              {mode === "predictor"
                ? "Fill in your percentage, category, and branches — then shortlist colleges to plan your option form."
                : "Type a college name, pick your category, and see all branch cutoffs for 2025."}
            </p>
          </div>
        )}

        {/* predictor no results */}
        {mode === "predictor" && searched && !loading && !error && results.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="w-12 h-12 rounded-full border border-[#2a2a2a] flex items-center justify-center mb-2">
              <Info size={20} strokeWidth={1.5} className="text-[#888]" />
            </div>
            <p className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-base">No colleges found</p>
            <p className="font-['General_Sans'] text-[#888] text-sm max-w-[320px] leading-relaxed">
              No 2025 cutoffs near {percentage}% for your selected branches and category
              {districtFilter ? ` in ${districtFilter}` : ""}. Try more branches, a different category
              {districtFilter ? ", or remove the district filter" : ""}.
            </p>
          </div>
        )}

        {/* predictor results grid */}
        {mode === "predictor" && searched && !loading && !error && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-['JetBrains_Mono'] text-[0.7rem] text-[#888] tracking-wider uppercase">
                {results.length} college{results.length !== 1 ? "s" : ""} found
                · {percentage}% · {category}
                {districtFilter ? ` · ${districtFilter}` : ""}
              </p>
              {shortlist.length > 0 && (
                <p className="font-['General_Sans'] text-[0.75rem] text-[#e8453c]">
                  {shortlist.length} shortlisted
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((c, i) => (
                <ResultCard key={c.college_code + c.course_name + i}
                  college={c} isShortlisted={isShortlisted(c)} onToggle={toggleShortlist} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ShortlistPanel shortlist={shortlist} onRemove={toggleShortlist} onClear={() => setShortlist([])} />
    </section>
  );
}