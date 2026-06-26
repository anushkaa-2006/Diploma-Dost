import { useState, useEffect } from 'react'
import {
  ArrowRight, ExternalLink, Briefcase, FileText, Mail, Users,
  Calendar, CheckCircle, AlertCircle, Lightbulb, Zap, Target,
  BookOpen, Code, TrendingUp, MessageSquare, Award, Clock, ChevronUp
} from 'lucide-react'

export default function InternshipsPage() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ── HERO ───────────────────────────────── */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(1.5rem, 6vw, 7rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Top accent line */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          opacity: 0.4,
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2.5rem',
          width: 'fit-content',
        }}>
          <span style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            boxShadow: '0 0 6px var(--accent)',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Kickstart Your Career
          </span>
        </div>

        {/* Main headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          marginBottom: '0.15em',
          maxWidth: '900px',
        }}>
          Land your first internship
        </h1>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          marginBottom: '0.15em',
          maxWidth: '900px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3em',
          flexWrap: 'wrap',
        }}>
          with confidence.{' '}
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--accent-lime)',
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          }}>
            Here's how.
          </span>
        </p>

        {/* Subtext */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          maxWidth: '500px',
          marginTop: '2rem',
          marginBottom: '2.5rem',
        }}>
          From finding opportunities to acing interviews. Complete guide to internships, including the mandatory MSBTE 6-week requirement.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <button
            onClick={() => document.getElementById('msbte-internship')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            MSBTE Requirement <ArrowRight size={15} />
          </button>
          <button
            onClick={() => document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-ghost"
          >
            Find Opportunities
          </button>
        </div>
      </section>

      {/* ── MSBTE MANDATORY INTERNSHIP ─────────── */}
      <section id="msbte-internship" style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Curriculum requirement
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}>
              MSBTE K-Scheme Mandatory Internship
            </h2>
          </div>
        </div>

        {/* MSBTE Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {[
            {
              label: 'Duration',
              value: '6 Weeks',
              desc: 'Minimum duration required by MSBTE'
            },
            {
              label: 'Timing',
              value: 'Summer Break',
              desc: 'Usually after Sem 4 or Sem 5'
            },
            {
              label: 'Requirement',
              value: 'Mandatory',
              desc: 'Completion is essential for passing'
            },
            {
              label: 'Credits',
              value: '4 Credits',
              desc: 'Part of your final grade'
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: '1.75rem',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '0.75rem',
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--text)',
                marginBottom: '0.5rem',
                letterSpacing: '-0.02em',
              }}>
                {item.value}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Important info box */}
        <div style={{
          background: 'rgba(200, 240, 77, 0.05)',
          border: '1px solid rgba(200, 240, 77, 0.2)',
          borderRadius: '1rem',
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <AlertCircle size={20} color="var(--accent-lime)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '0.25rem' }} />
            <div>
              <h3 style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: 'var(--accent-lime)',
                marginBottom: '0.75rem',
                letterSpacing: '-0.01em',
              }}>
                What You Need to Know
              </h3>
              <ul style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                paddingLeft: '1.5rem',
              }}>
                <li style={{ marginBottom: '0.5rem' }}>Your college will provide a list of approved companies or allow you to find your own.</li>
                <li style={{ marginBottom: '0.5rem' }}>You must submit a report and get it signed by your internship supervisor.</li>
                <li style={{ marginBottom: '0.5rem' }}>Some colleges conduct viva exams on your internship work.</li>
                <li>Start looking for internships 2-3 months before your summer break.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TYPES OF INTERNSHIPS ───────────────── */}
      <section style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Options
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}>
              Types of internships
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}>
          {[
            {
              title: 'Summer Internship',
              emoji: '☀️',
              duration: '6-12 weeks',
              timing: 'May-July',
              desc: 'The most common type. Perfect for gaining experience before final year.',
              best: 'Best for: Everyone, especially MSBTE requirement'
            },
            {
              title: 'Winter Internship',
              emoji: '❄️',
              duration: '4-8 weeks',
              timing: 'Dec-Jan',
              desc: 'During semester break. Shorter but still valuable.',
              best: 'Best for: Sem 5-6 students, pre-placement prep'
            },
            {
              title: 'Full-Time Internship',
              emoji: '💼',
              duration: '3-6 months',
              timing: 'After graduation',
              desc: 'Post-graduation before joining full-time. Great for learning.',
              best: 'Best for: Gap year students, pre-job experience'
            },
            {
              title: 'Remote Internship',
              emoji: '🏠',
              duration: 'Flexible',
              timing: 'Anytime',
              desc: 'Work from home. Perfect if you can\'t relocate.',
              best: 'Best for: Flexibility seekers, multiple internships'
            },
          ].map((type, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{type.emoji}</span>
                <h3 style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                }}>
                  {type.title}
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}>
                <div style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                    marginBottom: '0.25rem',
                  }}>
                    Duration
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                  }}>
                    {type.duration}
                  </div>
                </div>
                <div style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--accent)',
                    marginBottom: '0.25rem',
                  }}>
                    Timing
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: 'var(--text)',
                  }}>
                    {type.timing}
                  </div>
                </div>
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
              }}>
                {type.desc}
              </p>

              <div style={{
                background: 'rgba(232, 69, 60, 0.05)',
                border: '1px solid rgba(232, 69, 60, 0.2)',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--accent)',
              }}>
                {type.best}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP PLATFORMS ──────────────────────── */}
      <section id="platforms" style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Where to search
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}>
              Top internship platforms
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            {
              name: 'Internshala',
              emoji: '🎓',
              desc: 'India\'s largest internship platform. 50,000+ internships listed.',
              pros: ['Largest database', 'Easy to apply', 'Indian focus'],
              link: 'https://internshala.com'
            },
            {
              name: 'LinkedIn',
              emoji: '💼',
              desc: 'Professional network. Search "internship" in jobs. Direct company access.',
              pros: ['Direct contact', 'Professional', 'Global'],
              link: 'https://www.linkedin.com/jobs'
            },
            {
              name: 'Naukri',
              emoji: '🔍',
              desc: 'Major Indian job portal. Filter by internships. Good for startups.',
              pros: ['Indian companies', 'Diverse roles', 'Easy filter'],
              link: 'https://www.naukri.com'
            },
            {
              name: 'AICTE Portal',
              emoji: '🏛️',
              desc: 'Official AICTE internship portal. Government-approved opportunities.',
              pros: ['Official', 'Verified', 'Credible'],
              link: 'https://www.aicte-india.org'
            },
            {
              name: 'AngelList',
              emoji: '🚀',
              desc: 'Startup jobs platform. Great for tech startups and innovation.',
              pros: ['Startups', 'Tech-focused', 'Global'],
              link: 'https://angel.co/jobs'
            },
            {
              name: 'Unstop',
              emoji: '🏆',
              desc: 'India’s leading platform to discover internships, hackathons, competitions, coding challenges, and career opportunities for students.',
              pros: [
                'Hackathons',
                'Internships',
                'Competitions'
              ],
              link: 'https://unstop.com'
            },
            {
              name: 'GitHub Jobs',
              emoji: '💻',
              desc: 'Tech-focused job board. Perfect for developers and tech roles.',
              pros: ['Tech jobs', 'Startup culture', 'Global'],
              link: 'https://github.com/jobs'
            },
          ].map((platform, idx) => (
            <a
              key={idx}
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(232, 69, 60, 0.4)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{platform.emoji}</span>
                <h3 style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                }}>
                  {platform.name}
                </h3>
              </div>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}>
                {platform.desc}
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {platform.pros.map((pro, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--accent-lime)',
                  }}>
                    <CheckCircle size={14} strokeWidth={2} />
                    {pro}
                  </div>
                ))}
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--accent)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: '0.85rem',
                marginTop: 'auto',
              }}>
                Visit <ExternalLink size={12} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── APPLICATION TOOLKIT ────────────────── */}
      <section style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Get the job
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}>
              The application toolkit
            </h2>
          </div>
        </div>

        {/* Resume Section */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '2.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'var(--text)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            📄 Build a Winning Resume
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}>
            {[
              {
                title: 'One Page Only',
                desc: 'Keep it concise. Recruiters spend 6 seconds on each resume.'
              },
              {
                title: 'Action Verbs',
                desc: 'Use "Developed", "Built", "Implemented" instead of "Worked on".'
              },
              {
                title: 'Quantify Results',
                desc: 'Say "Improved performance by 30%" not "Improved performance".'
              },
              {
                title: 'Tailor for Role',
                desc: 'Match keywords from the job description in your resume.'
              },
              {
                title: 'Projects > Experience',
                desc: 'If new, highlight projects and skills instead of work history.'
              },
              {
                title: 'No Typos',
                desc: 'Proofread 3 times. Typos are instant rejections.'
              },
            ].map((tip, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                }}
              >
                <h4 style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: 'var(--accent)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em',
                }}>
                  {tip.title}
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}>
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(200, 240, 77, 0.05)',
            border: '1px solid rgba(200, 240, 77, 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              <strong style={{ color: 'var(--text)' }}>Resume Templates:</strong> Use Canva, Google Docs, or Overleaf. Keep it simple — no fancy colors or graphics.
            </p>
          </div>
        </div>

        {/* Cover Letter Section */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '2.5rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'var(--text)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            ✍️ Write a Compelling Cover Letter
          </h3>

          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--accent-lime)',
            lineHeight: 1.8,
            marginBottom: '1.5rem',
            overflow: 'auto',
          }}>
            <div>Dear [Hiring Manager Name],</div>
            <div style={{ marginTop: '0.5rem' }}>I am a [Sem X] diploma student in [Branch] at [College Name]. I am excited to apply for the [Internship Role] position at [Company].</div>
            <div style={{ marginTop: '0.5rem' }}>During my studies, I have developed strong skills in [Relevant Skills]. I have completed projects in [Project Names], which have given me hands-on experience with [Technologies].</div>
            <div style={{ marginTop: '0.5rem' }}>I am particularly interested in [Company] because [Reason - their work, culture, tech stack]. I believe this internship will help me grow as a developer and contribute meaningfully to your team.</div>
            <div style={{ marginTop: '0.5rem' }}>Thank you for considering my application. I look forward to hearing from you.</div>
            <div style={{ marginTop: '0.5rem' }}>Best regards,<br />[Your Name]</div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {[
              'Keep it to 3-4 short paragraphs',
              'Personalize for each company',
              'Show enthusiasm, not desperation',
              'Mention specific projects or skills',
            ].map((tip, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(232, 69, 60, 0.05)',
                  border: '1px solid rgba(232, 69, 60, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}
              >
                ✓ {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Cold Email Section */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '2.5rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'var(--text)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            📧 Cold Email Strategy
          </h3>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '1.5rem',
          }}>
            Don't wait for job postings. Email companies directly. Here's how:
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            {[
              {
                step: '1',
                title: 'Find the Right Email',
                desc: 'Use Hunter.io, RocketReach, or LinkedIn to find HR/Hiring Manager emails.'
              },
              {
                step: '2',
                title: 'Personalize Subject Line',
                desc: 'Subject: "Internship Opportunity - [Your Name] | [Your Skills]"'
              },
              {
                step: '3',
                title: 'Keep It Short',
                desc: 'Max 150 words. Mention why you\'re interested in their company specifically.'
              },
              {
                step: '4',
                title: 'Include Your Best Work',
                desc: 'Link to your GitHub, portfolio, or a project you\'re proud of.'
              },
              {
                step: '5',
                title: 'Follow Up',
                desc: 'If no response in 1 week, send a polite follow-up email.'
              },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text)',
                    marginBottom: '0.25rem',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(200, 240, 77, 0.05)',
            border: '1px solid rgba(200, 240, 77, 0.2)',
            borderRadius: '0.75rem',
            padding: '1rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              <strong style={{ color: 'var(--text)' }}>Pro Tip:</strong> Cold emails have a 2-5% response rate. Send 20-30 per week. You only need one "yes"!
            </p>
          </div>
        </div>
      </section>

      {/* ── INTERVIEW PREP ─────────────────────── */}
      <section style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Ace it
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}>
              Interview preparation
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {[
            {
              title: 'Common Questions',
              questions: [
                'Tell me about yourself',
                'Why do you want to intern here?',
                'What are your strengths & weaknesses?',
                'Describe a project you\'re proud of',
                'What do you know about our company?',
              ]
            },
            {
              title: 'Technical Questions',
              questions: [
                'Basic DSA (arrays, strings, sorting)',
                'SQL queries (if backend role)',
                'Explain your project architecture',
                'Debugging & problem-solving',
                'Code review & best practices',
              ]
            },
            {
              title: 'Behavioral Tips',
              questions: [
                'Prepare 3-4 short stories (STAR method)',
                'Practice speaking clearly & confidently',
                'Make eye contact (or look at camera)',
                'Ask thoughtful questions at the end',
                'Send thank-you email after interview',
              ]
            },
          ].map((category, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: '2rem',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: '1.05rem',
                color: 'var(--text)',
                marginBottom: '1.5rem',
                letterSpacing: '-0.01em',
              }}>
                {category.title}
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                {category.questions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: 'var(--surface2)',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      marginTop: '0.5rem',
                      flexShrink: 0,
                    }} />
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'var(--text)',
                      lineHeight: 1.6,
                    }}>
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* STAR Method */}
        <div style={{
          background: 'rgba(232, 69, 60, 0.05)',
          border: '1px solid rgba(232, 69, 60, 0.2)',
          borderRadius: '1rem',
          padding: '2rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 800,
            fontSize: '1.05rem',
            color: 'var(--accent)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            🎯 The STAR Method (For Behavioral Questions)
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                letter: 'S',
                word: 'Situation',
                desc: 'Set the context. "I was working on a project where..."'
              },
              {
                letter: 'T',
                word: 'Task',
                desc: 'What was your responsibility? "I had to..."'
              },
              {
                letter: 'A',
                word: 'Action',
                desc: 'What did you do? "I took these steps..."'
              },
              {
                letter: 'R',
                word: 'Result',
                desc: 'What was the outcome? "This led to..."'
              },
            ].map((star, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  margin: '0 auto 0.75rem',
                }}>
                  {star.letter}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em',
                }}>
                  {star.word}
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}>
                  {star.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREPARATION CHECKLIST ──────────────── */}
      <section style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
      }}>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>
              Checklist
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}>
              Your internship preparation timeline
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            {
              phase: '3 Months Before',
              items: [
                'Update your resume',
                'Build a GitHub profile',
                'Complete 2-3 small projects',
                'Start DSA practice',
              ]
            },
            {
              phase: '2 Months Before',
              items: [
                'Create LinkedIn profile',
                'Connect with 50+ people',
                'Research target companies',
                'Start applying on platforms',
              ]
            },
            {
              phase: '1 Month Before',
              items: [
                'Send cold emails (20-30)',
                'Practice coding problems',
                'Prepare STAR stories',
                'Mock interviews with friends',
              ]
            },
            {
              phase: 'During Interviews',
              items: [
                'Research company thoroughly',
                'Prepare questions to ask',
                'Dress professionally',
                'Send thank-you emails',
              ]
            },
          ].map((phase, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '1rem',
                padding: '1.75rem',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--accent)',
                marginBottom: '1.25rem',
                letterSpacing: '-0.01em',
              }}>
                {phase.phase}
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                {phase.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <CheckCircle size={16} color="var(--accent-lime)" strokeWidth={2} />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--text)',
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────── */}
      <section style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 6vw, 7rem)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '3rem',
      }}>

        <div style={{ maxWidth: '540px' }}>
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>
            Ready?
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            lineHeight: 1.05,
            marginBottom: '1.25rem',
          }}>
            Start your internship hunt today
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '2rem',
            maxWidth: '400px',
          }}>
            Update your resume, build your portfolio, and start applying. Remember: consistency beats perfection. Every application brings you closer to your first internship.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://internshala.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Briefcase size={14} /> Browse Internshala
            </a>
            <a
              href="https://www.linkedin.com/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Go to LinkedIn
            </a>
          </div>
        </div>

        {/* Right side — timeline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          borderLeft: '1px solid var(--border)',
          paddingLeft: '3rem',
        }}>
          {[
            { time: 'Week 1', task: 'Update resume & portfolio' },
            { time: 'Week 2-3', task: 'Apply to 20+ opportunities' },
            { time: 'Week 4-5', task: 'Send cold emails' },
            { time: 'Week 6+', task: 'Attend interviews & negotiate' },
            { time: 'Result', task: 'Land your internship! 🎉' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: idx === 4 ? 'var(--accent-lime)' : 'var(--accent)',
                color: 'var(--bg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--accent)',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {item.time}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                }}>
                  {item.task}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <ChevronUp size={16} />
        </button>
      )}

    </div>
  )
}
