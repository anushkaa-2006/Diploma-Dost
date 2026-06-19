export default function AdmissionProgress() {
  const admissionSteps = [
    {
      title: "MSBTE Result Declared",
      status: "current",
      date: "18 Jun 2026",
      link: "https://result.msbte.ac.in/pcwebBTRes/pcResult01/pcfrmViewMSBTEResult.aspx"
    },
    { title: "Admission Registration", status: "upcoming" },
    { title: "Document Verification", status: "upcoming" },
    { title: "Provisional Merit List", status: "upcoming" },
    { title: "Merit List Corrections", status: "upcoming" },
    { title: "Final Merit List", status: "upcoming" },

    { title: "CAP Round 1 - Seat Matrix", status: "upcoming" },
    { title: "CAP Round 1 - Option Form", status: "upcoming" },
    { title: "CAP Round 1 - Allotment", status: "upcoming" },
    { title: "CAP Round 1 - Admission Confirmation", status: "upcoming" },

    { title: "CAP Round 2 - Vacant Seats", status: "upcoming" },
    { title: "CAP Round 2 - Option Form", status: "upcoming" },
    { title: "CAP Round 2 - Allotment", status: "upcoming" },
    { title: "CAP Round 2 - Admission Confirmation", status: "upcoming" },

    { title: "CAP Round 3 - Vacant Seats", status: "upcoming" },
    { title: "CAP Round 3 - Option Form", status: "upcoming" },
    { title: "CAP Round 3 - Allotment", status: "upcoming" },
    { title: "CAP Round 3 - Admission Confirmation", status: "upcoming" },

    { title: "CAP Round 4 - Vacant Seats", status: "upcoming" },
    { title: "CAP Round 4 - Option Form", status: "upcoming" },
    { title: "CAP Round 4 - Allotment", status: "upcoming" },
    { title: "CAP Round 4 - Admission Confirmation", status: "upcoming" },

    { title: "Institute Level Applications", status: "upcoming" },
    { title: "Institute Level Admissions", status: "upcoming" },
    { title: "Vacant Seat Admissions", status: "upcoming" },
    { title: "Admission Closed", status: "upcoming" }
  ];

  const currentStep = admissionSteps.find(
    (step) => step.status === "current"
  );

  const completedCount = admissionSteps.filter(
    (step) => step.status === "completed"
  ).length;

  const progress = Math.round(
    ((completedCount + 1) / admissionSteps.length) * 100
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-['Clash_Display'] text-4xl md:text-5xl font-bold mb-3 text-[var(--text)]">
          Admission Progress
        </h1>
        <p className="font-['General_Sans'] text-lg text-[var(--text-muted)]">
          Live updates for Diploma to Degree admissions.
        </p>
      </div>

      {/* Current Update */}
      <div className="bg-[var(--surface)] border border-[#c8f04d]/30 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-3 w-3 rounded-full bg-[#c8f04d] animate-pulse flex-shrink-0"></span>
          <span className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.12em] text-[#c8f04d] font-bold">
            Current Update
          </span>
        </div>
        <h2 className="font-['Clash_Display'] text-2xl font-bold text-[var(--text)] mb-2">
          {currentStep?.title}
        </h2>
        <p className="font-['General_Sans'] text-[var(--text-muted)]">
          MSBTE Summer 2026 Result has been declared. Admission registration
          schedule is yet to be announced.
        </p>
        <a
          href={currentStep?.link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 bg-[#c8f04d] text-[var(--bg)] hover:opacity-90 transition-opacity
                     px-5 py-2 rounded-lg font-['Cabinet_Grotesk'] font-semibold text-sm"
        >
          Check Result
        </a>
      </div>

      {/* Progress */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-8">
        <div className="flex justify-between mb-3">
          <span className="font-['Cabinet_Grotesk'] font-semibold text-[var(--text)]">
            Admission Journey Progress
          </span>
          <span className="font-['JetBrains_Mono'] font-bold text-[#c8f04d]">
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-[var(--surface2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c8f04d] transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="font-['Clash_Display'] text-2xl font-bold mb-6 text-[var(--text)]">
          Admission Timeline
        </h2>

        <div className="space-y-3">
          {admissionSteps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-xl border ${
                step.status === "completed"
                  ? "border-[#e8453c]/30 bg-[#e8453c]/10"
                  : step.status === "current"
                  ? "border-[#c8f04d]/30 bg-[#c8f04d]/10"
                  : "border-[var(--border)] bg-[var(--surface2)]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-3.5 w-3.5 rounded-full flex-shrink-0 ${
                    step.status === "completed"
                      ? "bg-[#e8453c]"
                      : step.status === "current"
                      ? "bg-[#c8f04d]"
                      : "bg-[var(--border)]"
                  }`}
                />
                <div>
                  <h3 className="font-['Cabinet_Grotesk'] font-medium text-[var(--text)]">
                    {step.title}
                  </h3>
                  {step.date && (
                    <p className="font-['General_Sans'] text-sm text-[var(--text-muted)] mt-0.5">
                      {step.date}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 md:mt-0 md:flex-shrink-0">
                {step.status === "completed" && (
                  <span className="font-['JetBrains_Mono'] text-[0.6rem] uppercase tracking-wider text-[#e8453c] font-bold">
                    Completed
                  </span>
                )}
                {step.status === "current" && (
                  <span className="font-['JetBrains_Mono'] text-[0.6rem] uppercase tracking-wider text-[#c8f04d] font-bold">
                    Current
                  </span>
                )}
                {step.status === "upcoming" && (
                  <span className="font-['General_Sans'] text-sm text-[var(--text-muted)]">
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#e8453c]"></div>
          <span className="font-['General_Sans'] text-sm text-[var(--text-muted)]">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#c8f04d]"></div>
          <span className="font-['General_Sans'] text-sm text-[var(--text-muted)]">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--border)]"></div>
          <span className="font-['General_Sans'] text-sm text-[var(--text-muted)]">Upcoming</span>
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 bg-[#f0a843]/10 border border-[#f0a843]/30 rounded-xl p-5">
        <p className="font-['General_Sans'] text-sm text-[#f0a843]">
          ⚠️ As of now, only the MSBTE Result (18 June 2026) has been declared.
          Admission registration and CAP round dates are yet to be announced by
          the CET Cell.
        </p>
      </div>
    </div>
  );
}