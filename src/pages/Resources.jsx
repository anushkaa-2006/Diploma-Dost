import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ExternalLink, FileText, BookOpen, Loader2, ChevronDown, Download, Link2 } from "lucide-react";


const BRANCHES = ["CS", "IT", "ME", "CE", "EE", "ENTC"];
const BRANCH_LABELS = {
  CS: "Computer Science",
  IT: "Information Technology", 
  ME: "Mechanical",
  CE: "Civil",
  EE: "Electrical",
  ENTC: "Electronics & Telecommunication",
};

const SEMESTERS = [1, 2, 3, 4, 5, 6];
const SEM_LABELS = {
  1: "First", 2: "Second", 3: "Third",
  4: "Fourth", 5: "Fifth", 6: "Sixth",
};

const TYPES = ["All", "PYQ", "Model Answer", "Notes"];
const UPLOAD_TYPES = [
  "Notes",
  "Solved Manuals",
  "PYQs",
  "Model Answers",
  "Study Resources",
];

const TYPE_CONFIG = {
  PYQ: { color: "#e8453c", label: "PYQ", icon: FileText },
  "Model Answer": { color: "#c8f04d", label: "Answer", icon: BookOpen },
  Notes: { color: "#4d9ef0", label: "Notes", icon: BookOpen },
};

// ── session pill ───────────────────────────────────────────────────────────────

function SessionPill({ subjectName, courseCode, entries }) {
  const byType = entries.reduce((acc, e) => {
    if (!acc[e.type]) acc[e.type] = [];
    acc[e.type].push(e);
    return acc;
  }, {});

  return (
    <div className="border border-[#2a2a2a] rounded-lg bg-[#141414] p-5 hover:border-[#e8453c]/30 transition-colors duration-150">
      {/* subject name + code */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-[1rem] leading-snug mb-1">
            {subjectName}
          </h3>
          <span className="font-['JetBrains_Mono'] text-[0.7rem] text-[#888] tracking-wider">
            {courseCode}
          </span>
        </div>
        <span className="shrink-0 font-['JetBrains_Mono'] text-[0.65rem] text-[#888] bg-[#1a1a1a] px-2 py-1 rounded">
          {Object.values(byType).reduce((sum, items) => sum + items.length, 0)} items
        </span>
      </div>

      {/* type groups */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#2a2a2a]">
        {Object.entries(byType).map(([type, items]) => {
          const config = TYPE_CONFIG[type] || TYPE_CONFIG.Notes;
          return (
            <div key={type} className="flex flex-col gap-2">
              {/* type badge */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[0.7rem] font-['JetBrains_Mono'] tracking-wide self-start"
                style={{
                  background: `${config.color}15`,
                  color: config.color,
                  borderColor: `${config.color}30`,
                }}
              >
                {config.icon === FileText && <FileText size={11} strokeWidth={2} />}
                {config.icon === BookOpen && <BookOpen size={11} strokeWidth={2} />}
                {config.label}
              </span>

              {/* session pills — wrap naturally, no scrollbar */}
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={item.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               border border-[#2a2a2a] bg-[#141414]
                               text-[#f0ede6] text-xs font-['General_Sans'] font-medium
                               hover:border-[#e8453c] hover:text-[#e8453c] hover:bg-[#e8453c]/5
                               transition-all duration-150 whitespace-nowrap"
                  >
                    <Download size={11} strokeWidth={2} />
                    {item.session}
                    <ExternalLink size={10} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── dropdown ───────────────────────────────────────────────────────────────────

function Dropdown({ value, onChange, options, labelMap }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5
                   border border-[#2a2a2a] rounded-lg bg-[#141414]
                   font-['General_Sans'] text-sm text-[#f0ede6]
                   hover:border-[#888] focus:border-[#e8453c] focus:outline-none
                   transition-colors duration-150
                   min-w-[160px] justify-between"
      >
        <span>{labelMap ? labelMap[value] || value : value}</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`text-[#888] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20
                          border border-[#2a2a2a] rounded-lg bg-[#141414]
                          shadow-xl min-w-full overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5
                            font-['General_Sans'] text-sm
                            hover:bg-[#1a1a1a] transition-colors duration-100
                            ${value === opt ? "text-[#e8453c] bg-[#e8453c]/5" : "text-[#f0ede6]"}`}
              >
                {labelMap ? labelMap[opt] || opt : opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────────

export default function Resources() {
  const [branch, setBranch] = useState("CS");
  const [semester, setSemester] = useState(1);
  const [typeFilter, setType] = useState("All");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);

  const [uploads, setUploads] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [uploadsError, setUploadsError] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    name: "",
    subject: UPLOAD_TYPES[0],
    semester: 1,
    drive_link: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData([]);

    let query = supabase
      .from("resources")
      .select("id, subject_name, course_code, semester, branch, type, session, drive_link")
      .eq("branch", branch)
      .eq("semester", semester)
      .order("subject_name", { ascending: true })
      .order("session", { ascending: true });

    if (typeFilter !== "All") {
      query = query.eq("type", typeFilter);
    }

    query.then(({ data: rows, error: err }) => {
      if (cancelled) return;
      if (err) { setError(err.message); setLoading(false); return; }
      setData(rows || []);
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setError('Failed to load resources. Check your connection.');
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [branch, semester, typeFilter]);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user || null);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function loadUploads() {
    setUploadsLoading(true);
    setUploadsError(null);
    try {
      const { data: rows, error: err } = await supabase
        .from('notes_submissions')
        .select(`
  id,
  name,
  subject,
  semester,
  drive_link,
  verified,
  created_at,
  uploaded_by,
  profiles:profiles!notes_submissions_uploaded_by_fkey (
    username
  )
`)
        .order('created_at', { ascending: false });

      if (err) {
        setUploadsError(err.message);
        setUploadsLoading(false);
        return;
      }

      const formatted = (rows || []).map((row) => {
        const profile = row.profiles || {};
        return {
          id: row.id,
          name: row.name || 'Untitled',
          subject: row.subject || 'Resource',
          semester: row.semester,
          drive_link: row.drive_link,
          verified: row.verified,
          created_at: row.created_at,
          username: profile.username || 'Unknown',
        };
      });

      setUploads(formatted);
    } catch (err) {
      setUploadsError(err?.message || 'Failed to load community uploads.');
    } finally {
      setUploadsLoading(false);
    }
  }

  useEffect(() => {
    loadUploads();
  }, []);

  function formatDate(dateValue) {
    if (!dateValue) return 'Unknown date';
    const date = new Date(dateValue);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function handleUploadField(field, value) {
    setUploadForm((prev) => ({ ...prev, [field]: value }));
    setUploadMessage('');
  }

  async function handleUploadSubmit(event) {
    event.preventDefault();
    if (!user) {
      navigate('/login?redirect=/resources');
      return;
    }

    const { name, subject, semester, drive_link } = uploadForm;
    if (!name.trim() || !subject || !drive_link.trim()) {
      setUploadMessage('Please provide a name, subject, semester, and Google Drive link before uploading.');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      const metadata = {
        name: name.trim(),
        subject,
        semester,
        drive_link: drive_link.trim(),
        uploaded_by: user.id,
      };

      const { error: insertError } = await supabase
        .from('notes_submissions')
        .insert([metadata]);

      if (insertError) {
        setUploadMessage(insertError.message || 'Failed to save upload.');
        setUploading(false);
        return;
      }

      setUploadMessage('Upload submitted successfully. It will appear for everyone shortly.');
      setUploadForm({ name: '', subject: UPLOAD_TYPES[0], semester: 1, drive_link: '' });
      await loadUploads();
    } catch (uploadError) {
      console.error(uploadError)
      setUploadMessage('An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const bySubject = data.reduce((acc, row) => {
    const key = row.course_code;
    if (!acc[key]) acc[key] = { subjectName: row.subject_name, courseCode: row.course_code, entries: [] };
    acc[key].entries.push(row);
    return acc;
  }, {});

  const subjects = Object.values(bySubject);

  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 pb-32">

      {/* ── header ── */}
      <div className="mb-12">
        <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[#e8453c] mb-3 font-bold">
          Study Material
        </p>
        <h1 className="font-['Clash_Display'] font-semibold text-[#f0ede6] leading-[1.08]
                       text-[clamp(2rem,5vw,3.25rem)] mb-3 letter-spacing-tight">
          Resources
        </h1>
        <p className="font-['General_Sans'] text-[#888] text-base max-w-[560px] leading-relaxed">
          PYQs, model answers, and notes for every subject — download directly from Google Drive.
        </p>
      </div>

      {/* ── filters ── */}
      <div className="mb-10 pb-6 border-b border-[#2a2a2a]">

        {/* branch tabs */}
        <div className="mb-4">
          <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.12em] text-[#888] mb-3 font-bold">
            Branch
          </p>
          <div className="flex flex-wrap gap-2">
            {BRANCHES.map((b) => (
              <button
                key={b}
                onClick={() => setBranch(b)}
                className={`flex flex-col items-start gap-0.5 px-4 py-2.5 rounded-lg
                            border transition-all duration-150
                            ${branch === b
                    ? "border-[#e8453c] bg-[#e8453c]/5"
                    : "border-[#2a2a2a] bg-transparent hover:border-[#888] hover:bg-[#141414]"
                  }`}
              >
                <span className={`font-['JetBrains_Mono'] text-[0.78rem] font-bold tracking-wider
                                  ${branch === b ? "text-[#e8453c]" : "text-[#f0ede6]"}`}>
                  {b}
                </span>
                <span className="font-['General_Sans'] text-[0.68rem] text-[#888] whitespace-nowrap hidden sm:block">
                  {BRANCH_LABELS[b]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* semester + type dropdowns */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex flex-col gap-2">
            <label className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.12em] text-[#888] font-bold">
              Semester
            </label>
            <Dropdown
              value={semester}
              onChange={setSemester}
              options={SEMESTERS}
              labelMap={SEM_LABELS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.12em] text-[#888] font-bold">
              Type
            </label>
            <Dropdown
              value={typeFilter}
              onChange={setType}
              options={TYPES}
            />
          </div>
        </div>

      </div>

      {/* ── results ── */}
      <div>

        {loading && (
          <div role="status" aria-label="Loading resources" className="flex flex-col items-center gap-3 py-24
                          font-['General_Sans'] text-[#888] text-sm">
            <Loader2 size={28} className="text-[#e8453c] animate-spin" aria-hidden="true" />
            <p className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6]">Loading resources…</p>
            <p className="text-[0.85rem]">Fetching study materials for {BRANCH_LABELS[branch]} Semester {semester}</p>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="flex flex-col items-center gap-2 py-24
                          font-['General_Sans'] text-[#e8453c] text-sm text-center">
            <p className="font-['Cabinet_Grotesk'] font-semibold">Could not load resources</p>
            <p>Check your connection and try again.</p>
          </div>
        )}

        {!loading && !error && subjects.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24
                          font-['General_Sans'] text-[#888] text-sm text-center">
            <FileText size={40} strokeWidth={1.2} aria-hidden="true" />
            <p className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6]">No resources yet</p>
            <p className="text-[0.85rem] max-w-[300px]">No resources found for {BRANCH_LABELS[branch]} — Semester {semester}. More content being added soon.</p>
          </div>
        )}

        {!loading && !error && subjects.length > 0 && (
          <div>
            <p className="font-['JetBrains_Mono'] text-[0.7rem] text-[#888]
                          tracking-wider uppercase mb-4 font-bold">
              {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
              {typeFilter !== "All" ? ` · ${typeFilter}` : ""}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((s) => (
                <SessionPill
                  key={s.courseCode}
                  subjectName={s.subjectName}
                  courseCode={s.courseCode}
                  entries={s.entries}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── community uploads ── */}
      <section className="mt-16 border-t border-[#2a2a2a] pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-6">
            <div className="max-w-[640px]">
              <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[#e8453c] mb-3 font-bold">
                Community Uploads
              </p>
              <h2 className="font-['Clash_Display'] font-semibold text-[#f0ede6] text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
                Share with Diploma Community
              </h2>
              <p className="font-['General_Sans'] text-[#888] text-base leading-relaxed">
                Help everyone study better by uploading your notes, solved manuals, PYQs, model answers, and other study resources. Your upload will be stored securely and made available to every student immediately.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 bg-[#141414] border border-[#2a2a2a] rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.12)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#f0ede6]">
                  Name
                  <input
                    value={uploadForm.name}
                    onChange={(e) => handleUploadField('name', e.target.value)}
                    placeholder="Example: CS PYQ Set 2024"
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[var(--surface)] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-[#f0ede6]">
                  Subject
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => handleUploadField('subject', e.target.value)}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[var(--surface)] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
                  >
                    {UPLOAD_TYPES.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#f0ede6]">
                  Semester
                  <select
                    value={uploadForm.semester}
                    onChange={(e) => handleUploadField('semester', parseInt(e.target.value, 10))}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[var(--surface)] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
                  >
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>Semester {sem} — {SEM_LABELS[sem]}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-[#f0ede6]">
                  Google Drive Link
                  <input
                    type="url"
                    value={uploadForm.drive_link}
                    onChange={(e) => handleUploadField('drive_link', e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[var(--surface)] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.9rem] text-[#888]">
                  {user ? `Logged in as ${user.user_metadata?.username || user.email}` : 'Login to upload resources.'}
                </p>
                <button type="submit" disabled={uploading} aria-busy={uploading} className="btn-primary inline-flex items-center justify-center px-5 py-3 rounded-lg">
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>

              {uploadMessage && (
                <p role="alert" className="text-sm text-[#e8453c]">{uploadMessage}</p>
              )}

              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-2">
                <p className="text-[0.8rem] font-['JetBrains_Mono'] uppercase tracking-wider text-[#888] font-bold">
                  Upload Instructions
                </p>
                <ul className="text-[0.85rem] text-[#888] space-y-1 list-disc list-inside">
                  <li>Upload your <strong className="text-[#f0ede6]">Notes</strong> for any subject</li>
                  <li>Share <strong className="text-[#f0ede6]">PYQs</strong> (Previous Year Questions)</li>
                  <li>Upload <strong className="text-[#f0ede6]">Model Answers</strong></li>
                  <li>Share <strong className="text-[#f0ede6]">Solved Manuals</strong></li>
                  <li>Upload any other <strong className="text-[#f0ede6]">Study Resources</strong></li>
                </ul>
                <p className="text-[0.8rem] text-[#888] flex items-center gap-1.5 mt-2">
                  <Link2 size={12} />
                  Paste a <strong className="text-[#f0ede6]">Google Drive</strong> share link for each upload.
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-['JetBrains_Mono'] text-[0.7rem] uppercase tracking-[0.16em] text-[#888] mb-2 font-bold">
                  Latest uploads
                </p>
                <h3 className="font-['Cabinet_Grotesk'] font-semibold text-[#f0ede6] text-2xl">
                  Community shared resources
                </h3>
              </div>
              <button
                type="button"
                onClick={loadUploads}
                className="btn-ghost px-4 py-2 rounded-lg text-sm"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-4">
              {uploadsLoading && (
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-6 text-center text-[#888]">
                  <Loader2 className="mx-auto mb-3 animate-spin text-[#e8453c]" size={24} />
                  Loading uploads…
                </div>
              )}

              {uploadsError && (
                <div className="bg-[#141414] border border-[#e8453c]/20 rounded-3xl p-6 text-[#e8453c]">
                  {uploadsError}
                </div>
              )}

              {!uploadsLoading && !uploadsError && uploads.length === 0 && (
                <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-6 text-[#888]">
                  No community uploads yet. Be the first to share something useful.
                </div>
              )}

              {!uploadsLoading && !uploadsError && uploads.map((upload) => (
                <div key={upload.id} className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-['Cabinet_Grotesk'] text-lg font-semibold text-[#f0ede6] truncate">
                        {upload.name}
                      </p>
                      <p className="font-['General_Sans'] text-sm text-[#888]">
                        {upload.subject} · Semester {upload.semester} · Uploaded by {upload.username}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span className="font-['JetBrains_Mono'] text-[0.75rem] uppercase tracking-[0.18em] text-[#888]">
                        {formatDate(upload.created_at)}
                      </span>
                      <a
                        href={upload.drive_link || undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[var(--surface)] px-4 py-2 text-sm text-[#f0ede6] hover:border-[#e8453c] hover:text-[#e8453c] transition-colors"
                      >
                        Open / View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}