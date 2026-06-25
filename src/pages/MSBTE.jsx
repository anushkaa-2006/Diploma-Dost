import { useState } from "react";
import { ChevronDown, Calendar, AlertCircle, CheckCircle, Clock, ExternalLink, FileText, Globe, User, CreditCard, Download } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ACADEMIC_YEAR = "2026–27";

const TERM_SCHEDULE = [
  // Closing 2025-26
  { label: "Summer 2026 Results (Expected)", date: "Late Jun 2026", status: "current" },

  // Odd Semester (Jul – Oct 2026)
  { label: "Odd Semester Start (Sem 3 & 5)", date: "1 Jul 2026", status: "upcoming" },
  { label: "1st Semester Start (New Admissions)", date: "15 Jul 2026", status: "upcoming" },
  { label: "Odd Sem Class Test 1 — 3rd Sem", date: "10–12 Aug 2026", status: "upcoming" },
  { label: "Winter 2026 Exam Form (Normal Fee)", date: "20–30 Aug 2026", status: "upcoming" },
  { label: "Winter 2026 Exam Form (Late Fee ₹200)", date: "1–3 Sep 2026", status: "upcoming" },
  { label: "Winter 2026 Exam Form (Penalty ₹1500)", date: "5–6 Sep 2026", status: "upcoming" },
  { label: "1st Sem Class Test 1", date: "10–11 Sep 2026", status: "upcoming" },
  { label: "Odd Sem Class Test 1 — 5th Sem", date: "21–22 Sep 2026", status: "upcoming" },
  { label: "Odd & 1st Sem Class Test 2", date: "12–14 Oct 2026", status: "upcoming" },
  { label: "Odd Semester End (Sem 3 & 5)", date: "17 Oct 2026", status: "upcoming" },
  { label: "Winter 2026 Practicals (Sem 3 & 5)", date: "21–31 Oct 2026", status: "upcoming" },
  { label: "1st Semester End", date: "30 Oct 2026", status: "upcoming" },
  { label: "Winter 2026 Practicals (1st Sem / 1st Year)", date: "2–6 Nov 2026", status: "upcoming" },
  { label: "Winter 2026 Theory Exams", date: "17 Nov – 9 Dec 2026", status: "upcoming" },

  // Even Semester (Dec 2026 – Apr 2027)
  { label: "Even Semester Start (Sem 2, 4 & 6)", date: "15 Dec 2026", status: "upcoming" },
  { label: "Winter 2026 Results (Expected)", date: "2nd Week Jan 2027", status: "upcoming" },
  { label: "Even Sem Class Test 1", date: "27–29 Jan 2027", status: "upcoming" },
  { label: "Summer 2027 Exam Form (Normal Fee)", date: "1–11 Feb 2027", status: "upcoming" },
  { label: "Summer 2027 Exam Form (Late Fee ₹200)", date: "13–15 Feb 2027", status: "upcoming" },
  { label: "Summer 2027 Exam Form (Penalty ₹1500)", date: "17–19 Feb 2027", status: "upcoming" },
  { label: "Even Sem Class Test 2", date: "31 Mar – 2 Apr 2027", status: "upcoming" },
  { label: "Even Semester End", date: "3 Apr 2027", status: "upcoming" },
  { label: "Summer 2027 Practicals", date: "8–19 Apr 2027", status: "upcoming" },
  { label: "Summer 2027 Theory Exams", date: "27 Apr – 19 May 2027", status: "upcoming" },
  { label: "Summer 2027 Results (Expected)", date: "3rd Week Jun 2027", status: "upcoming" },
];

const QUICK_LINKS = [
  { label: "MSBTE Official Website", url: "https://msbte.ac.in/", icon: Globe, color: "#4d9ef0" },
  { label: "Student Login (Exam Forms)", url: "https://online.msbte.co.in/", icon: User, color: "#c8f04d" },
  { label: "Winter 2026 Timetable", url: "https://online.msbte.co.in/timetable/", icon: Calendar, color: "#e8453c" },
  { label: "Check Results", url: "https://msbte.ac.in/", icon: CheckCircle, color: "#b87aff" },
  { label: "Hall Ticket Download", url: "https://online.msbte.co.in/", icon: CreditCard, color: "#f0a843" },
  { label: "Academic Calendar 2026-27", url: "https://msbte.ac.in/", icon: Download, color: "#4d9ef0" },
];

const RECHECKING_STEPS = [
  {
    step: "01",
    title: "Check your result first",
    desc: "Go to msbte.ac.in → Results. Enter your enrollment number. Download/screenshot your marksheet — you'll need it.",
    note: null,
  },
  {
    step: "02",
    title: "Decide: Photocopy or Re-evaluation?",
    desc: "Photocopy = you get a scanned copy of your answer sheet to review. Re-evaluation = your paper gets re-checked by an examiner. You must get a photocopy before applying for re-evaluation.",
    note: "Note: Online exam subjects (MCQ-based) have NO photocopy or rechecking option.",
  },
  {
    step: "03",
    title: "Apply via Student Login",
    desc: "Login at online.msbte.co.in with your enrollment number. Go to 'Photocopy/Rechecking' section. Select the subject(s) and pay the fee online.",
    note: null,
  },
  {
    step: "04",
    title: "Get institute confirmation",
    desc: "After you apply, your institute needs to confirm your application via their portal. Go to your exam department/office and tell them. They must confirm within the given window (usually 1–2 days after student login closes).",
    note: null,
  },
  {
    step: "05",
    title: "Submit original marksheet",
    desc: "For re-evaluation, submit your original MSBTE marksheet (not a printout) to your institute. They'll send it to the regional RBTE office in a sealed envelope. Without this, your re-evaluation won't be confirmed.",
    note: "Critical: This step is missed by most students. Don't skip it.",
  },
  {
    step: "06",
    title: "Wait for result",
    desc: "Photocopy is distributed by the institute within ~14 days. Re-evaluation result is announced via your institute and on msbte.ac.in. If marks change, a revised marksheet is issued.",
    note: null,
  },
];

const FEES = [
  { item: "Photocopy (per subject)", amount: "₹200 – ₹300" },
  { item: "Re-evaluation (per subject)", amount: "₹800 – ₹1000" },
  { item: "Exam form late fee (first window)", amount: "₹200" },
  { item: "Exam form late fee (second window)", amount: "₹1,500" },
  { item: "Special provision (forgot to fill form)", amount: "₹5,000 per subject" },
];

const NOTICES = [
  {
    tag: "Live Now",
    color: "#e8453c",
    title: "Summer 2026 Results Expected Soon",
    desc: "Summer 2026 theory exams ended May 2026. Results are expected by end of June 2026. Keep checking the MSBTE portal.",
    link: "https://msbte.ac.in/",
    linkLabel: "Check Results Portal →",
  },
  {
    tag: "Upcoming",
    color: "#c8f04d",
    title: "New Academic Year 2026-27 Starts 1 Jul 2026",
    desc: "Odd semester (Sem 3 & 5) begins July 1. 1st semester for new admissions begins July 15, 2026 (as per admission authority date).",
    link: null,
    linkLabel: null,
  },
  {
    tag: "Important",
    color: "#f0a843",
    title: "Winter 2026 Exam Form: Aug 20 – Sep 6",
    desc: "Normal fee window: Aug 20–30. Late fee (₹200): Sep 1–3. Penalty (₹1500): Sep 5–6. RBTE confirmation deadline: Sep 9, 2026 by 5:00 PM.",
    link: "https://online.msbte.co.in/",
    linkLabel: "Student Login →",
  },
  {
    tag: "Info",
    color: "#b87aff",
    title: "Online Exam Subjects — No Rechecking",
    desc: "MCQ-based online subjects have no photocopy or rechecking option per MSBTE's latest circular.",
    link: null,
    linkLabel: null,
  },
];

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[#e8453c] mb-2 font-bold">
        {eyebrow}
      </p>
      <h2 className="font-['Clash_Display'] text-[clamp(1.5rem,3vw,2.5rem)] font-semibold text-[#f0ede6] leading-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="font-['General_Sans'] text-[0.95rem] text-[#888] max-w-[560px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── TIMELINE SECTION ────────────────────────────────────────────────────────

function TimelineSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? TERM_SCHEDULE : TERM_SCHEDULE.slice(0, 10);

  const statusConfig = {
    done:     { dot: "bg-[#c8f04d]/10 border border-[#c8f04d]/30", text: "text-[#c8f04d]", dateTxt: "text-[#c8f04d]", icon: CheckCircle },
    current:  { dot: "bg-[#e8453c] ring-4 ring-[#e8453c]/20", text: "text-[#f0ede6] font-semibold", dateTxt: "text-[#e8453c]", icon: Clock },
    upcoming: { dot: "bg-[#2a2a2a] border-2 border-[#4d9ef0]", text: "text-[#888]", dateTxt: "text-[#666]", icon: Calendar },
  };

  return (
    <div className="mb-12">
      <SectionHeader eyebrow={`Academic Year ${ACADEMIC_YEAR}`} title="Important Dates" subtitle="Key milestones and exam schedules for your diploma journey." />
      
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[15px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#e8453c] via-[#2a2a2a] to-[#2a2a2a]" />
        
        <div className="space-y-4">
          {visible.map((item, i) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <div key={i} className="flex gap-6 relative">
                <div className="flex-shrink-0 mt-1 relative z-10">
                  <div className={`w-8 h-8 rounded-full ${config.dot} flex items-center justify-center`}>
                    <Icon size={14} color={item.status === 'done' ? '#c8f04d' : item.status === 'current' ? '#fff' : '#4d9ef0'} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1 flex items-start justify-between gap-4 min-w-0 pb-4 border-b border-[#1a1a1a] last:border-0">
                  <span className={`font-['General_Sans'] text-[0.95rem] leading-snug ${config.text}`}>
                    {item.label}
                  </span>
                  <span className={`font-['JetBrains_Mono'] text-[0.8rem] flex-shrink-0 ${config.dateTxt}`}>
                    {item.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {!expanded && TERM_SCHEDULE.length > visible.length && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-6 inline-flex items-center gap-2 font-['General_Sans'] text-[0.9rem] text-[#e8453c] hover:text-[#f0a843] transition-colors"
        >
          <ChevronDown size={16} strokeWidth={2} />
          Show all {TERM_SCHEDULE.length} dates
        </button>
      )}
      
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-6 inline-flex items-center gap-2 font-['General_Sans'] text-[0.9rem] text-[#888] hover:text-[#f0ede6] transition-colors"
        >
          <ChevronDown size={16} strokeWidth={2} className="rotate-180" />
          Show less
        </button>
      )}
    </div>
  );
}

// ─── NOTICES SECTION ─────────────────────────────────────────────────────────

function NoticesSection() {
  return (
    <div className="mb-12">
      <SectionHeader eyebrow="Live Updates" title="Important Notices" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NOTICES.map((n, i) => (
          <div
            key={i}
            className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 hover:border-[#e8453c]/30 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span
                className="font-['JetBrains_Mono'] text-[0.65rem] tracking-widest uppercase px-2.5 py-1 rounded-full font-bold"
                style={{ color: n.color, background: `${n.color}18`, border: `1px solid ${n.color}40` }}
              >
                {n.tag}
              </span>
            </div>
            <h3 className="font-['Cabinet_Grotesk'] text-[1rem] font-semibold text-[#f0ede6] mb-2">
              {n.title}
            </h3>
            <p className="font-['General_Sans'] text-[0.9rem] text-[#888] leading-relaxed mb-3">
              {n.desc}
            </p>
            {n.link && (
              <a
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-['General_Sans'] text-[0.85rem] font-medium transition-colors"
                style={{ color: n.color }}
              >
                {n.linkLabel}
                <ExternalLink size={12} strokeWidth={2} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUICK LINKS SECTION ─────────────────────────────────────────────────────

function QuickLinksSection() {
  return (
    <div className="mb-12">
      <SectionHeader eyebrow="MSBTE Portals" title="Quick Links" subtitle="Direct access to official MSBTE portals and resources." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#e8453c]/40 hover:bg-[#1a1a1a] transition-all duration-150"
          >
            <span
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: `${link.color}18`, color: link.color }}
            >
              <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="font-['Cabinet_Grotesk'] text-[0.95rem] font-semibold text-[#f0ede6] flex-1 leading-snug">
              {link.label}
            </span>
            <ExternalLink size={14} strokeWidth={1.5} className="text-[#555] group-hover:text-[#e8453c] transition-colors flex-shrink-0" />
          </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── RECHECKING SECTION ──────────────────────────────────────────────────────

function RecheckingSection() {
  const [openStep, setOpenStep] = useState(null);

  return (
    <div className="mb-12">
      <SectionHeader 
        eyebrow="After Results" 
        title="Photocopy & Rechecking Guide" 
        subtitle="Step-by-step process to request photocopy or re-evaluation of your answer sheets."
      />

      <div className="bg-[#1a1a1a] border border-[#c8f04d]/20 rounded-lg px-5 py-4 mb-6 flex gap-3">
        <AlertCircle size={18} className="text-[#c8f04d] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <p className="font-['General_Sans'] text-[0.9rem] text-[#888] leading-relaxed">
          The rechecking window opens roughly 1–2 days after results are published and stays open for only 2–3 days. Watch msbte.ac.in and your college notice board closely right after results.
        </p>
      </div>

      <div className="space-y-2 mb-8">
        {RECHECKING_STEPS.map((s, i) => {
          const isOpen = openStep === i;
          return (
            <div
              key={i}
              className={`border rounded-lg overflow-hidden transition-all ${isOpen ? "border-[#e8453c]/40 bg-[#141414]" : "border-[#2a2a2a] bg-[var(--surface)] hover:border-[#2a2a2a]"}`}
            >
              <button
                onClick={() => setOpenStep(isOpen ? null : i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="font-['Clash_Display'] text-[1.2rem] font-bold text-[#e8453c] flex-shrink-0 w-8">
                  {s.step}
                </span>
                <span className="font-['Cabinet_Grotesk'] text-[1rem] font-semibold text-[#f0ede6] flex-1">
                  {s.title}
                </span>
                <ChevronDown
                  size={18}
                  strokeWidth={2}
                  className={`text-[#888] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pl-20 space-y-3 border-t border-[#1a1a1a]">
                  <p className="font-['General_Sans'] text-[0.95rem] text-[#888] leading-relaxed">
                    {s.desc}
                  </p>
                  {s.note && (
                    <div className="bg-[#e8453c]/8 border border-[#e8453c]/20 rounded-lg px-4 py-3">
                      <p className="font-['General_Sans'] text-[0.9rem] text-[#e8453c] leading-relaxed">
                        <strong>⚠️ {s.note.split(':')[0]}:</strong> {s.note.split(':')[1]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fees Table */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[#2a2a2a]">
          <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.12em] text-[#888] font-bold">
            Fee Reference
          </p>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {FEES.map((f, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1a1a1a] transition-colors">
              <span className="font-['General_Sans'] text-[0.95rem] text-[#888]">
                {f.item}
              </span>
              <span className="font-['JetBrains_Mono'] text-[0.9rem] font-bold text-[#c8f04d]">
                {f.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5">
        <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.12em] text-[#888] mb-3 font-bold">
          Apply when window opens
        </p>
        <a
          href="https://online.msbte.co.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-['Cabinet_Grotesk'] text-[1rem] font-semibold text-[#4d9ef0] hover:text-[#6db4ff] transition-colors"
        >
          online.msbte.co.in — Student Login
          <ExternalLink size={16} strokeWidth={1.5} />
        </a>
        <p className="font-['General_Sans'] text-[0.85rem] text-[#555] mt-2">
          Login with your enrollment number and password (same as exam form login)
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function MSBTE() {
  return (
    <section className="max-w-[1100px] mx-auto px-6 py-20 pb-32">

      {/* ── header ── */}
      <div className="mb-16">
        <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[#e8453c] mb-3 font-bold">
          MSBTE K-Scheme
        </p>
        <h1 className="font-['Clash_Display'] text-[clamp(2rem,5vw,3.5rem)] font-semibold text-[#f0ede6] leading-tight mb-4">
          Important Dates & Deadlines
        </h1>
        <p className="font-['General_Sans'] text-[1rem] text-[#888] max-w-[600px] leading-relaxed">
          Stay on top of exam schedules, form submission deadlines, and important MSBTE announcements. Never miss a critical date again.
        </p>
      </div>

      {/* ── timeline ── */}
      <TimelineSection />

      {/* ── notices ── */}
      <NoticesSection />

      {/* ── quick links ── */}
      <QuickLinksSection />

      {/* ── rechecking ── */}
      <RecheckingSection />

    </section>
  );
}
