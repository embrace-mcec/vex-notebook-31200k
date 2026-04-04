import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine, Legend
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const teamMembers = [
  {
    name: "Matthew Lin",
    grade: "Grade 3",
    roles: ["Driver", "Builder"],
    icon: "🎮",
    color: "#FFB703",
    quote: "Robotics is like Lego — but it moves and you control it!",
    interests: ["Skiing", "Lego", "Art"],
  },
  {
    name: "Ray Zhao",
    grade: "Grade 5",
    roles: ["Driver", "Programmer"],
    icon: "💻",
    color: "#00C9B1",
    quote: "I want to combine my love of building with programming.",
    interests: ["Lego", "Coding", "VEX IQ"],
  },
  {
    name: "Liam Qian",
    grade: "Grade 3",
    roles: ["Builder"],
    icon: "🔧",
    color: "#9B5DE5",
    quote: "Building a robot is like making a big toy I designed myself.",
    interests: ["Building", "Mechanics"],
  },
  {
    name: "Chen Li",
    grade: "Grade 5",
    roles: ["Builder", "Notebooker"],
    icon: "📖",
    color: "#06D6A0",
    quote: "Robotics is the future. I want to be a software engineer.",
    interests: ["Software Engineering", "Future Tech"],
  },
];

const competitionData = [
  { event: "Caution Tape (Nov 2)", avg: 39.4, rank: 49, skills: 43 },
  { event: "Brampton (Nov 15)", avg: 88.2, rank: 20, skills: null },
  { event: "Brampton (Jan 17)", avg: 68.7, rank: 10, skills: null },
  { event: "Caution Tape LNY (Feb 8)", avg: 99.2, rank: 15, skills: 60, award: "2nd Innovate" },
];

const vrSkillsData = [
  { month: "Sep", score: 20 },
  { month: "Oct", score: 35 },
  { month: "Nov", score: 43 },
  { month: "Dec", score: 55 },
  { month: "Jan", score: 140 },
];

const programTimeline = [
  { date: "Sep 21", title: "Initial Setup", desc: "Configured VEXcode, motor ports, basic drive logic." },
  { date: "Sep 28", title: "Movement Logic", desc: "Turning functions and speed calibration for Tank Drive." },
  { date: "Oct 05", title: "Mechanism Control", desc: "Claw motor integration and open/close commands." },
  { date: "Oct 12", title: "Automation Upgrade", desc: "Distance sensor for automated arm movement (Innovate Award)." },
  { date: "Oct 19", title: "Autonomous Skills", desc: "Refined autonomous routine and tuned timing parameters." },
];

const seasonEvents = [
  { date: "Jun 2025", label: "Registration", color: "#FFB703", type: "phase" },
  { date: "Sep 2025", label: "First Meeting", color: "#00C9B1", type: "milestone" },
  { date: "Nov 2", label: "Caution Tape Qualifier\n(Innovate Award 🏆)", color: "#FB8500", type: "milestone" },
  { date: "Nov 15", label: "Brampton Mix & Match\n(Supporting 31200A)", color: "#FB8500", type: "milestone" },
  { date: "Jan 17", label: "Brampton Mix & Match\n(Supporting 31200A)", color: "#FB8500", type: "milestone" },
  { date: "Feb 8", label: "Caution Tape LNY Qualifier\n(2nd Innovate Award 🏆)", color: "#FB8500", type: "milestone" },
  { date: "Mar 7-8", label: "Ontario Provincials 🎯", color: "#4CC9F0", type: "milestone" },
  { date: "May 2026", label: "World Championship 🌍", color: "#06D6A0", type: "goal" },
];

const gameElements = [
  {
    title: "Scoring Objects",
    desc: "Pins and Beams that can be stacked to form scoring structures.",
    icon: "📦",
    details: ["Pins (various colors)", "Beams (connectors)", "Must be roughly vertical"]
  },
  {
    title: "Floor Goal",
    desc: "Ground-level goal where scoring objects can be placed.",
    icon: "🎯",
    details: ["Accepts stacks", "Counts toward match score", "Neutral zone"]
  },
  {
    title: "Standoff Goal",
    desc: "Elevated goal structure for high-value scoring.",
    icon: "🏗️",
    details: ["Higher elevation", "Bonus points for stacks", "Strategic placement"]
  },
  {
    title: "Connected Stacks",
    desc: "Multiple scoring objects nested together vertically.",
    icon: "🔗",
    details: ["Roughly vertical orientation", "No robot contact", "Multi-color bonuses"]
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavDot({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 group"
      title={label}
    >
      <div
        className="w-3 h-3 rounded-full transition-all duration-300"
        style={{
          background: active ? color : "rgba(255,255,255,0.2)",
          boxShadow: active ? `0 0 8px ${color}` : "none",
          transform: active ? "scale(1.3)" : "scale(1)",
        }}
      />
      <span
        className="label-mono text-xs transition-all duration-300"
        style={{ color: active ? color : "rgba(255,255,255,0.4)", opacity: active ? 1 : 0 }}
      >
        {label}
      </span>
    </button>
  );
}

function SectionTag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="label-mono text-xs px-3 py-1 border"
      style={{ color, borderColor: color, background: `${color}15` }}
    >
      {children}
    </span>
  );
}

function StatBox({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="p-4 border" style={{ borderColor: `${color}30`, background: `${color}08` }}>
      <div className="label-mono text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>
      <div className="stat-number text-3xl" style={{ color }}>{value}</div>
      {sub && <div className="label-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</div>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const sections = [
    { id: "hero", label: "Overview", color: "#FFB703" },
    { id: "team", label: "Team", color: "#FFB703" },
    { id: "game", label: "Game", color: "#FF6B9D" },
    { id: "design", label: "Design", color: "#9B5DE5" },
    { id: "programming", label: "Code", color: "#06D6A0" },
    { id: "competition", label: "Competition", color: "#FB8500" },
    { id: "season", label: "Season", color: "#4CC9F0" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex((r) => r === entry.target);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { threshold: 0.4 }
    );
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="blueprint-bg min-h-screen text-white">
      {/* Fixed Nav */}
      <nav className="fixed top-1/2 right-6 -translate-y-1/2 z-50 flex flex-col gap-4">
        {sections.map((s, i) => (
          <NavDot key={s.id} label={s.label} active={activeSection === i} color={s.color} onClick={() => scrollTo(i)} />
        ))}
      </nav>

      {/* ── HERO ── */}
      <section
        ref={(el) => { sectionRefs.current[0] = el; }}
        id="hero"
        className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      >
        {/* Decorative circuit lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-0 w-64 h-px" style={{ background: "linear-gradient(90deg, transparent, #FFB703, transparent)" }} />
          <div className="absolute bottom-32 right-0 w-96 h-px" style={{ background: "linear-gradient(90deg, transparent, #00C9B1, transparent)" }} />
          <div className="absolute top-1/3 right-20 w-px h-32" style={{ background: "linear-gradient(180deg, transparent, #9B5DE5, transparent)" }} />
        </div>

        <div className="container max-w-6xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Identity */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px" style={{ background: "#FFB703" }} />
                <SectionTag color="#FFB703">TEAM 31200K</SectionTag>
              </div>

              <h1 className="text-6xl lg:text-7xl font-extrabold leading-none mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                INTELLIGENCE
                <br />
                <span style={{ color: "#FFB703" }}>WINS</span>
              </h1>

              <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                VEX IQ Mix & Match Season 2025–2026 Engineering Notebook. Four elementary school students from Ontario, Canada — building, coding, and competing at the highest level.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {["Ontario Provincial Championship", "2x Innovate Award Winner", "Canada #2 VR Skills"].map((badge) => (
                  <span key={badge} className="label-mono text-xs px-3 py-2 border" style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
                    {badge}
                  </span>
                ))}
              </div>

              <button
                onClick={() => scrollTo(1)}
                className="px-8 py-3 font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background: "#FFB703",
                  color: "#0D1B2A",
                  fontFamily: "'Space Grotesk', sans-serif",
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                EXPLORE NOTEBOOK →
              </button>

              {/* Disclaimer - Official Judging Notice */}
              <div className="mt-8 p-6 border-2" style={{ borderColor: "#FFB703", background: "rgba(255,183,3,0.12)" }}>
                <div style={{ color: "#FFB703", fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}>IMPORTANT FOR OFFICIAL JUDGING</div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: "1.6", marginBottom: "10px" }}>
                  This interactive website was generated by Manus AI based on the team's digital notebook. For official judging, please download the original notebook.
                </div>
                <a href="https://drive.google.com/file/d/1bef_fgSsYnDYQaQP_ZbmuP0qvX6yoWlf/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 border" style={{ borderColor: "#FFB703", color: "#FFB703", fontSize: "12px", fontWeight: "600", background: "rgba(255,183,3,0.1)", textDecoration: "none" }}>
                  📥 DOWNLOAD OFFICIAL NOTEBOOK
                </a>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="TEAM MEMBERS" value="4" sub="Grades 3 & 5" color="#FFB703" />
              <StatBox label="CANADA VR RANK" value="#2" sub="Robot Skills" color="#00C9B1" />
              <StatBox label="WORLD VR RANK" value="#55" color="#06D6A0" />
              <StatBox label="INNOVATE AWARD" value="2x" sub="Nov 2, 2025 & Feb 8, 2026" color="#06D6A0" />
              <div className="col-span-2 p-4 border" style={{ borderColor: "#4CC9F030", background: "#4CC9F008" }}>
                <div className="label-mono text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>NEXT MILESTONE</div>
                <div className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#4CC9F0" }}>
                  Ontario Provincial Championship
                </div>
                <div className="label-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>MARCH 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        ref={(el) => { sectionRefs.current[1] = el; }}
        id="team"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(255,183,3,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#FFB703" }} />
            <SectionTag color="#FFB703">CHAPTER 01</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#FFB703" }}>Meet the Team</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Four students who believe that intelligence — not just strength — wins competitions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((m) => (
              <div
                key={m.name}
                className="p-6 border transition-all duration-300 hover:translate-y-[-2px]"
                style={{
                  borderColor: `${m.color}25`,
                  background: `${m.color}06`,
                  borderLeft: `4px solid ${m.color}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `${m.color}15`,
                      border: `2px solid ${m.color}`,
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.name}</h3>
                      <span className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{m.grade}</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {m.roles.map((r) => (
                        <span key={r} className="label-mono text-xs px-2 py-0.5" style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}40` }}>
                          {r}
                        </span>
                      ))}
                    </div>
                    <blockquote className="text-sm italic mb-3" style={{ color: "rgba(255,255,255,0.7)", borderLeft: `2px solid ${m.color}50`, paddingLeft: 12 }}>
                      "{m.quote}"
                    </blockquote>
                    <div className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      ★ {m.interests.join(" · ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Name Vote */}
          <div className="mt-10 p-6 border" style={{ borderColor: "rgba(255,183,3,0.2)", background: "rgba(255,183,3,0.04)" }}>
            <div className="label-mono text-xs mb-3" style={{ color: "#FFB703" }}>SEP 7 — TEAM NAME VOTE</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">Intelligence Wins (31200K)</span>
                  <span className="label-mono text-xs" style={{ color: "#FFB703" }}>SELECTED ✓</span>
                </div>
                <div className="h-3 bg-white/10 relative overflow-hidden">
                  <div className="h-full" style={{ width: "65%", background: "#FFB703" }} />
                </div>
                <div className="label-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>65% of votes</div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold">Robotics Wins (31200A)</span>
                  <span className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Sister Team</span>
                </div>
                <div className="h-3 bg-white/10 relative overflow-hidden">
                  <div className="h-full" style={{ width: "35%", background: "rgba(255,255,255,0.3)" }} />
                </div>
                <div className="label-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>35% of votes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GAME ANALYSIS ── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        id="game"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(255,107,157,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#FF6B9D" }} />
            <SectionTag color="#FF6B9D">CHAPTER 02</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#FF6B9D" }}>VEX IQ Mix & Match</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Understanding the game mechanics from the official VEX Robotics manual — Game-Specific Definitions section.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {gameElements.map((el) => (
              <div key={el.title} className="p-6 border" style={{ borderColor: "rgba(255,107,157,0.25)", background: "rgba(255,107,157,0.05)", borderLeft: "4px solid #FF6B9D" }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{el.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{el.title}</h3>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{el.desc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {el.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <span style={{ color: "#FF6B9D" }}>▸</span> {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key Rules */}
          <div className="p-6 border" style={{ borderColor: "rgba(255,107,157,0.25)", background: "rgba(255,107,157,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#FF6B9D" }}>KEY SCORING RULES (SC1-SC6)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-3">Scoring Basics</h4>
                <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <li>✓ All scoring statuses evaluated <strong>after match ends</strong></li>
                  <li>✓ Evaluated <strong>visually by Head Referee</strong></li>
                  <li>✓ Scoring Objects can be <strong>Connected to form Stacks</strong></li>
                  <li>✓ Multi-color Stacks receive <strong>additional bonus points</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">Connected Stacks</h4>
                <ul className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <li>✓ Must be <strong>roughly vertical</strong> (goes 'up', not sideways)</li>
                  <li>✓ Pins must be <strong>fully nested</strong> with other objects</li>
                  <li>✓ Beams can connect to up to <strong>3 Pins simultaneously</strong></li>
                  <li>✓ <strong>No robot contact</strong> with the Stack</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="mt-8 p-6 border" style={{ borderColor: "rgba(255,107,157,0.2)", borderLeft: "4px solid #FF6B9D" }}>
            <h4 className="font-bold mb-4" style={{ color: "#FF6B9D" }}>Strategic Insights for Team 31200K</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "🎯", title: "Multi-Color Strategy", desc: "Prioritize 3-color stacks for maximum bonus points" },
                { icon: "⚖️", title: "Vertical Precision", desc: "Ensure stacks are perfectly vertical to avoid disqualification" },
                { icon: "🤖", title: "Automation Advantage", desc: "Our sensor-driven claw automates stack placement for consistency" },
              ].map((insight) => (
                <div key={insight.title} className="p-4 border" style={{ borderColor: "rgba(255,107,157,0.15)", background: "rgba(255,107,157,0.03)" }}>
                  <div className="text-2xl mb-2">{insight.icon}</div>
                  <div className="font-semibold text-sm mb-1">{insight.title}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{insight.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DESIGN & BUILD ── */}
      <section
        ref={(el) => { sectionRefs.current[3] = el; }}
        id="design"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(155,93,229,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#9B5DE5" }} />
            <SectionTag color="#9B5DE5">CHAPTER 03</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#9B5DE5" }}>Design & Build</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Engineering decisions that shaped our robot — from design brainstorming to final mechanism tuning.
          </p>

          {/* Design Brainstorming Phase */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(155,93,229,0.25)", background: "rgba(155,93,229,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>EARLY SEASON — DESIGN BRAINSTORMING</div>
            <h3 className="text-2xl font-bold mb-6">Robot Design Selection Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border" style={{ borderColor: "rgba(155,93,229,0.15)" }}>
                <div className="text-lg font-bold mb-2" style={{ color: "#9B5DE5" }}>Hero Bot</div>
                <div className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Official VEX IQ reference</div>
                <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <div>Simple structure</div>
                  <div>Good for learning</div>
                  <div>Limited competitive edge</div>
                </div>
              </div>
              <div className="p-4 border" style={{ borderColor: "rgba(155,93,229,0.15)" }}>
                <div className="text-lg font-bold mb-2" style={{ color: "#9B5DE5" }}>180 Flipping Mech</div>
                <div className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Community design</div>
                <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <div>Faster stacking</div>
                  <div>Better scoring potential</div>
                  <div>Competitive advantage</div>
                </div>
              </div>
              <div className="p-4 border" style={{ borderColor: "rgba(155,93,229,0.3)", background: "rgba(155,93,229,0.1)" }}>
                <div className="text-lg font-bold mb-2" style={{ color: "#9B5DE5" }}>OUR CHOICE</div>
                <div className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>180 Mech Robot</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Grab two pins and flip them onto a beam to create high-value stacks</div>
              </div>
            </div>
          </div>

          {/* Initial Build Phase */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(155,93,229,0.25)", background: "rgba(155,93,229,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>SEP 21 — INITIAL BUILD</div>
            <h3 className="text-2xl font-bold mb-4">Foundation Assembly</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-2xl">⚙</span>
                  <div>
                    <div className="font-semibold">Long Gear System</div>
                    <div className="text-sm text-white/60">Connects wheels for smooth synchronized movement</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">📐</span>
                  <div>
                    <div className="font-semibold">Alignment & Calibration</div>
                    <div className="text-sm text-white/60">Ensured proper gear synchronization for reliable drive</div>
                  </div>
                </div>
              </div>
              <div className="p-4" style={{ background: "rgba(155,93,229,0.1)", border: "1px dashed rgba(155,93,229,0.3)" }}>
                <div className="label-mono text-xs mb-2" style={{ color: "#9B5DE5" }}>KEY MILESTONE</div>
                <div className="text-sm">Established stable drivetrain foundation that would support all future mechanisms</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drivetrain Decision */}
            <div className="p-6 border" style={{ borderColor: "rgba(155,93,229,0.25)", background: "rgba(155,93,229,0.05)" }}>
              <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>SEP 28 — DRIVETRAIN ANALYSIS</div>
              <h3 className="text-xl font-bold mb-4">Drivetrain Selection</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th className="text-left py-2 label-mono text-xs" style={{ color: "#9B5DE5" }}>FEATURE</th>
                    <th className="text-left py-2 label-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>X-DRIVE</th>
                    <th className="text-left py-2 label-mono text-xs" style={{ color: "#9B5DE5" }}>TANK DRIVE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Movement", "Omni-directional", "Linear + Turn"],
                    ["Complexity", "High", "Low"],
                    ["Reliability", "Moderate", "High"],
                  ].map(([f, x, t]) => (
                    <tr key={f} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td className="py-2 text-white/60">{f}</td>
                      <td className="py-2 text-white/40">{x}</td>
                      <td className="py-2 font-semibold" style={{ color: "#9B5DE5" }}>{t}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "rgba(155,93,229,0.1)" }}>
                    <td className="py-2 font-bold">VERDICT</td>
                    <td className="py-2 text-red-400/70">Rejected</td>
                    <td className="py-2 font-bold" style={{ color: "#9B5DE5" }}>SELECTED ✓</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 p-3" style={{ background: "#9B5DE5", color: "#0D1B2A" }}>
                <div className="font-bold text-sm">DECISION: TANK DRIVE</div>
                <div className="text-xs mt-1 opacity-80">Chosen for stability, reliability, and driver control.</div>
              </div>
            </div>

            {/* Claw Mechanism */}
            <div className="p-6 border" style={{ borderColor: "rgba(155,93,229,0.25)", background: "rgba(155,93,229,0.05)" }}>
              <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>OCT 05 — MECHANISM DESIGN</div>
              <h3 className="text-xl font-bold mb-4">Claw Mechanism</h3>
              <div className="space-y-4">
                {[
                  { icon: "🎯", title: "Design Goal", desc: "T-shaped 3-color stack for maximum points." },
                  { icon: "⚙️", title: "Actuation", desc: "Piston-driven arms with rubber band passive grip." },
                  { icon: "🔒", title: "Security", desc: "Integrated clamp prevents pin slippage during transport." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-sm mb-0.5">{item.title}</div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border border-dashed" style={{ borderColor: "rgba(155,93,229,0.4)", background: "rgba(155,93,229,0.05)" }}>
                <div className="label-mono text-xs mb-2" style={{ color: "#9B5DE5" }}>SCORING STRATEGY: T-SHAPE STACK</div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="flex gap-0.5">
                      <div className="w-8 h-4 border border-white/30" style={{ background: "#FFD700" }} />
                      <div className="w-8 h-4 border border-white/30" style={{ background: "#0000FF" }} />
                      <div className="w-8 h-4 border border-white/30" style={{ background: "#FF0000" }} />
                    </div>
                    <div className="w-8 h-4 border border-white/30" style={{ background: "#FFD700" }} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold" style={{ color: "#9B5DE5" }}>91 pts</div>
                    <div className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>3-COLOR T-STACK</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mid-Season Design Iteration */}
          <div className="mt-12 p-8 border" style={{ borderColor: "rgba(155,93,229,0.25)", background: "rgba(155,93,229,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>MID-SEASON — DESIGN EVOLUTION (DEC 7)</div>
            <h3 className="text-2xl font-bold mb-6">Robot Design v2 Brainstorming</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 border" style={{ borderColor: "rgba(155,93,229,0.15)" }}>
                <div className="font-bold mb-2" style={{ color: "#9B5DE5" }}>180 Mech v1</div>
                <div className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Proven in competition</div>
                <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <div>Reliable performance at two events</div>
                  <div>Known mechanics and tuning</div>
                  <div>Competitive results (Innovate Award)</div>
                </div>
              </div>
              <div className="p-4 border" style={{ borderColor: "rgba(155,93,229,0.15)" }}>
                <div className="font-bold mb-2" style={{ color: "#9B5DE5" }}>Revolver Design</div>
                <div className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Alternative approach</div>
                <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <div>Experimental mechanics</div>
                  <div>Untested in competitive matches</div>
                  <div>Higher risk with uncertain reward</div>
                </div>
              </div>
            </div>
            <div className="p-4" style={{ background: "rgba(155,93,229,0.1)", border: "1px solid rgba(155,93,229,0.3)" }}>
              <div className="font-semibold mb-1">Final Decision: Stick with 180 Mech v1</div>
              <div className="text-sm text-white/70">After Feb 8 competition success and strong Innovate Award recognition, team decided proven design was best strategy for Provincial Championship</div>
            </div>
          </div>

          {/* Improvements */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                date: "OCT 19",
                title: "Tubing Optimization",
                problem: "Long tubes interfering with gears, causing jerky movement.",
                fix: "Trimmed excess length and rerouted away from moving parts.",
                result: "Smooth operation, zero interference.",
                before: null,
                after: null,
              },
              {
                date: "FEB 08",
                title: "Grip & Strategy Upgrade",
                problem: "Pins slipping during transport (6/10 success rate).",
                fix: "Added tension rubber bands + targeted Standoff Goal (+10 pts).",
                result: "Grip success rate improved to 9/10.",
                before: 60,
                after: 90,
              },
            ].map((imp) => (
              <div key={imp.title} className="p-5 border" style={{ borderColor: "rgba(155,93,229,0.2)", borderLeft: "4px solid #9B5DE5" }}>
                <div className="label-mono text-xs mb-2" style={{ color: "#9B5DE5" }}>{imp.date}</div>
                <div className="font-bold text-base mb-3">{imp.title}</div>
                <div className="text-sm p-2 mb-2" style={{ background: "rgba(255,107,107,0.08)", borderLeft: "2px solid #FF6B6B", color: "#FF6B6B" }}>
                  ✕ {imp.problem}
                </div>
                <div className="text-sm p-2 mb-2" style={{ background: "rgba(6,214,160,0.08)", borderLeft: "2px solid #06D6A0", color: "#06D6A0" }}>
                  ✓ {imp.fix}
                </div>
                {imp.before !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between label-mono text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>GRIP SUCCESS RATE</span>
                      <span style={{ color: "#06D6A0" }}>+{imp.after! - imp.before}%</span>
                    </div>
                    <div className="h-2 bg-white/10 overflow-hidden">
                      <div className="h-full flex">
                        <div style={{ width: `${imp.before}%`, background: "#FF6B6B", opacity: 0.5 }} />
                        <div style={{ width: `${imp.after! - imp.before}%`, background: "#06D6A0" }} />
                      </div>
                    </div>
                    <div className="flex justify-between label-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <span>BEFORE: {imp.before}%</span>
                      <span>AFTER: {imp.after}%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTING & TUNING ── */}
      <section
        ref={(el) => { sectionRefs.current[7] = el; }}
        id="testing"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(76,201,240,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#4CC9F0" }} />
            <SectionTag color="#4CC9F0">CHAPTER 07</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#4CC9F0" }}>Testing & Tuning</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Iterative refinement through systematic testing, performance measurement, and rapid prototyping.
          </p>

          {/* First Drive Testing */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(76,201,240,0.25)", background: "rgba(76,201,240,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>OCT 12 — FIRST DRIVE TESTING</div>
            <h3 className="text-2xl font-bold mb-6">Initial Performance Evaluation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>First time team members drove the robot in a 30-second run. Tested movement, scoring capability, and driver performance to select drivers for future matches.</div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="font-semibold">Objective</div>
                      <div className="text-sm text-white/60">Evaluate driver performance and robot responsiveness</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-semibold">Methodology</div>
                      <div className="text-sm text-white/60">Each driver completed a 30-second run with scoring</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border" style={{ borderColor: "rgba(76,201,240,0.2)" }}>
                <div className="label-mono text-xs mb-3" style={{ color: "#4CC9F0" }}>DRIVER PERFORMANCE SCORES</div>
                <div className="space-y-2">
                  {[
                    { name: "Matthew", score: 16, selected: true },
                    { name: "Yusuf", score: 2, selected: false },
                    { name: "Eesa", score: 2, selected: false },
                    { name: "Chen", score: 2, selected: false },
                  ].map((driver) => (
                    <div key={driver.name} className="flex justify-between items-center pb-2" style={{ borderBottom: "1px solid rgba(76,201,240,0.1)" }}>
                      <span className="text-sm">{driver.name}</span>
                      <div className="flex gap-2 items-center">
                        <span className="label-mono text-xs" style={{ color: driver.selected ? "#4CC9F0" : "rgba(255,255,255,0.4)" }}>{driver.score} pts</span>
                        {driver.selected && <span style={{ color: "#4CC9F0" }}>✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tubing Optimization */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(76,201,240,0.25)", background: "rgba(76,201,240,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>OCT 19 — TUBING OPTIMIZATION</div>
            <h3 className="text-2xl font-bold mb-6">Mechanical Refinement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border" style={{ borderColor: "rgba(76,201,240,0.15)" }}>
                <div className="text-lg font-bold mb-2" style={{ color: "#4CC9F0" }}>Problem</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Long tubes interfering with gears, causing jerky movement and inconsistent performance</div>
              </div>
              <div className="p-4 border" style={{ borderColor: "rgba(76,201,240,0.15)" }}>
                <div className="text-lg font-bold mb-2" style={{ color: "#4CC9F0" }}>Solution</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Trimmed excess length and rerouted tubes away from moving parts</div>
              </div>
              <div className="p-4 border" style={{ borderColor: "rgba(76,201,240,0.3)", background: "rgba(76,201,240,0.1)" }}>
                <div className="text-lg font-bold mb-2" style={{ color: "#4CC9F0" }}>Result</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Smooth operation, zero interference, improved reliability</div>
              </div>
            </div>
          </div>

          {/* Grip & Strategy Upgrade */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(76,201,240,0.25)", background: "rgba(76,201,240,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>FEB 8 — GRIP & STRATEGY UPGRADE</div>
            <h3 className="text-2xl font-bold mb-6">Pre-Competition Optimization</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="label-mono text-xs mb-2" style={{ color: "#4CC9F0" }}>MECHANICAL IMPROVEMENT</div>
                  <div className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Added tension rubber bands to claw mechanism</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Increased grip force and pin retention during transport</div>
                </div>
                <div>
                  <div className="label-mono text-xs mb-2" style={{ color: "#4CC9F0" }}>STRATEGIC ADJUSTMENT</div>
                  <div className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Targeted Standoff Goal placement</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Added 10 points per successful stack placement</div>
                </div>
              </div>
              <div className="p-6 border" style={{ borderColor: "rgba(76,201,240,0.2)", background: "rgba(76,201,240,0.08)" }}>
                <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>PERFORMANCE METRICS</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Grip Success Rate</span>
                      <span className="label-mono text-xs" style={{ color: "#4CC9F0" }}>+50%</span>
                    </div>
                    <div className="h-2 bg-white/10 relative overflow-hidden">
                      <div className="h-full flex">
                        <div className="w-1/2 bg-red-500/40" />
                        <div className="w-1/2" style={{ background: "#4CC9F0" }} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>Before: 6/10</span>
                      <span>After: 9/10</span>
                    </div>
                  </div>
                  <div className="pt-3" style={{ borderTop: "1px solid rgba(76,201,240,0.2)" }}>
                    <div className="text-sm font-semibold mb-1">Result</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Reliable pin transport enabled consistent scoring and Innovate Award recognition</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Testing Principles */}
          <div className="p-8 border" style={{ borderColor: "rgba(76,201,240,0.25)", background: "rgba(76,201,240,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>TESTING METHODOLOGY</div>
            <h3 className="text-2xl font-bold mb-6">Continuous Improvement Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: "🔍", title: "Identify", desc: "Systematic observation of robot behavior during testing" },
                { icon: "🔧", title: "Diagnose", desc: "Root cause analysis of performance issues" },
                { icon: "⚙️", title: "Refine", desc: "Rapid prototyping and mechanical adjustments" },
                { icon: "📈", title: "Measure", desc: "Quantify improvements with performance metrics" },
              ].map((step) => (
                <div key={step.title} className="flex gap-4">
                  <div className="text-3xl">{step.icon}</div>
                  <div>
                    <div className="font-semibold mb-1">{step.title}</div>
                    <div className="text-sm text-white/60">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMMING ── */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        id="programming"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(6,214,160,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#06D6A0" }} />
            <SectionTag color="#06D6A0">CHAPTER 04</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#06D6A0" }}>Programming Journey</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Building the robot's brain — from basic drive code to sensor automation and autonomous skills.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Timeline */}
            <div>
              <div className="relative pl-8 border-l-2" style={{ borderColor: "rgba(6,214,160,0.3)" }}>
                {programTimeline.map((item, i) => (
                  <div key={item.date} className="mb-8 relative">
                    <div
                      className="absolute -left-[37px] top-1 w-3 h-3 rounded-full border-2"
                      style={{ borderColor: "#06D6A0", background: "#0D1B2A", boxShadow: "0 0 8px rgba(6,214,160,0.5)" }}
                    />
                    <div className="label-mono text-xs mb-1" style={{ color: "#06D6A0" }}>{item.date}</div>
                    <div className="font-bold text-base mb-1">{item.title}</div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VR Skills Chart + Programmer */}
            <div className="flex flex-col gap-6">
              {/* Code snippet */}
              <div className="border overflow-hidden" style={{ borderColor: "rgba(6,214,160,0.3)", background: "#09121D" }}>
                <div className="px-4 py-2 flex items-center gap-2 border-b" style={{ borderColor: "rgba(6,214,160,0.2)", background: "rgba(6,214,160,0.08)" }}>
                  <span className="text-xs" style={{ color: "#06D6A0", fontFamily: "'Space Mono', monospace" }}>main.cpp — VEXcode Pro</span>
                </div>
                <pre className="p-4 text-xs overflow-x-auto" style={{ fontFamily: "'Space Mono', monospace", lineHeight: 1.8 }}>
                  <span style={{ color: "#5C677D" }}>// Key Features</span>{"\n"}
                  <span style={{ color: "#C792EA" }}>void</span> <span style={{ color: "#82AAFF" }}>setupRobot</span>{"() {"}{"\n"}
                  {"  "}<span style={{ color: "#5C677D" }}>// 1. Tank Drive</span>{"\n"}
                  {"  "}Drivetrain.<span style={{ color: "#82AAFF" }}>setDriveMode</span>(<span style={{ color: "#C3E88D" }}>Tank</span>);{"\n"}
                  {"  "}<span style={{ color: "#5C677D" }}>// 2. Sensor Automation</span>{"\n"}
                  {"  "}<span style={{ color: "#C792EA" }}>if</span> (DistanceSensor.<span style={{ color: "#82AAFF" }}>objectDetected</span>()) {"{"}{"\n"}
                  {"    "}Claw.<span style={{ color: "#82AAFF" }}>close</span>(); <span style={{ color: "#5C677D" }}>// Auto-grab</span>{"\n"}
                  {"  }"}{"\n"}
                  {"  "}<span style={{ color: "#5C677D" }}>// 3. Autonomous</span>{"\n"}
                  {"  "}Competition.<span style={{ color: "#82AAFF" }}>autonomous</span>(runSkills);{"\n"}
                  {"}"}
                </pre>
              </div>

              {/* VR Skills Progress Chart */}
              <div className="p-5 border" style={{ borderColor: "rgba(6,214,160,0.2)", background: "rgba(6,214,160,0.04)" }}>
                <div className="label-mono text-xs mb-4" style={{ color: "#06D6A0" }}>VR SKILLS SCORE PROGRESSION</div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vrSkillsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'Space Mono', monospace" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'Space Mono', monospace" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0D1B2A", border: "1px solid rgba(6,214,160,0.3)", fontFamily: "'Space Mono', monospace", fontSize: 12 }} />
                      <Line type="monotone" dataKey="score" stroke="#06D6A0" strokeWidth={2} dot={{ fill: "#06D6A0", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Programmer Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 p-4 border flex flex-col items-center justify-center" style={{ borderColor: "rgba(6,214,160,0.2)", background: "rgba(6,214,160,0.06)" }}>
                  <div className="text-3xl mb-1">👨‍💻</div>
                  <div className="font-bold text-sm text-center">Ray Zhao</div>
                  <div className="label-mono text-xs" style={{ color: "#06D6A0" }}>PROGRAMMER</div>
                </div>
                <StatBox label="CANADA RANK" value="#2" color="#06D6A0" />
                <StatBox label="WORLD RANK" value="#55" color="#06D6A0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROBOT SPECIFICATIONS ── */}
      <section
        ref={(el) => { sectionRefs.current[5] = el; }}
        id="specifications"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(76,201,240,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#4CC9F0" }} />
            <SectionTag color="#4CC9F0">TECHNICAL REFERENCE</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#4CC9F0" }}>Robot Specifications</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Complete technical documentation of the 180 Mech v1 robot design, including motors, sensors, and mechanical systems.
          </p>

          {/* Key Innovations */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(76,201,240,0.25)", background: "rgba(76,201,240,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>DESIGN HIGHLIGHTS</div>
            <h3 className="text-2xl font-bold mb-6">Key Innovations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Distance Sensor Automation",
                  desc: "Reduces manual driver input and enables consistent arm positioning without button presses"
                },
                {
                  title: "Pneumatic Claw Design",
                  desc: "Reliable grip with adjustable tension via rubber bands for consistent pin transport"
                },
                {
                  title: "Tank Drive Simplicity",
                  desc: "Prioritizes reliability and driver confidence over complex maneuverability"
                },
                {
                  title: "Tubing Optimization",
                  desc: "Shortened and rerouted to prevent mechanical interference and ensure smooth operation"
                },
              ].map((innovation, idx) => (
                <div key={idx} className="p-4 border" style={{ borderColor: "rgba(76,201,240,0.15)" }}>
                  <div className="font-semibold mb-2" style={{ color: "#4CC9F0" }}>{innovation.title}</div>
                  <div className="text-sm text-white/70">{innovation.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                title: "Drivetrain System",
                icon: "⚙️",
                specs: [
                  { label: "Type", value: "Tank Drive (2-motor)" },
                  { label: "Motors", value: "2x VEX IQ Smart Motors" },
                  { label: "Wheels", value: "4-wheel configuration" },
                  { label: "Advantage", value: "Simple, reliable, straight movement" },
                ]
              },
              {
                title: "Claw & Clamp Mechanism",
                icon: "🦾",
                specs: [
                  { label: "Type", value: "Pneumatic-actuated claw" },
                  { label: "Actuators", value: "Pistons with rubber band tension" },
                  { label: "Success Rate", value: "90% (9/10 transports)" },
                  { label: "Improvement", value: "+50% from initial 60%" },
                ]
              },
              {
                title: "Arm & Lift System",
                icon: "🔧",
                specs: [
                  { label: "Type", value: "180-degree rotating arm" },
                  { label: "Motor", value: "1x VEX IQ Smart Motor" },
                  { label: "Range", value: "Full 180-degree rotation" },
                  { label: "Height Extended", value: "18+ inches" },
                ]
              },
              {
                title: "Sensor & Automation",
                icon: "📡",
                specs: [
                  { label: "Primary Sensor", value: "Distance sensor" },
                  { label: "Function", value: "Automated arm positioning" },
                  { label: "Threshold", value: "20mm for arm lock" },
                  { label: "Benefit", value: "Eliminates manual button presses" },
                ]
              },
            ].map((section, idx) => (
              <div key={idx} className="p-6 border" style={{ borderColor: "rgba(76,201,240,0.2)", background: "rgba(76,201,240,0.03)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{section.icon}</span>
                  <h4 className="font-semibold" style={{ color: "#4CC9F0" }}>{section.title}</h4>
                </div>
                <div className="space-y-3">
                  {section.specs.map((spec, sidx) => (
                    <div key={sidx} className="flex justify-between items-start gap-3 pb-2" style={{ borderBottom: "1px solid rgba(76,201,240,0.1)" }}>
                      <span className="label-mono text-xs text-white/60">{spec.label}</span>
                      <span className="text-sm text-right" style={{ color: "rgba(255,255,255,0.8)" }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="p-8 border" style={{ borderColor: "rgba(76,201,240,0.25)", background: "rgba(76,201,240,0.05)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#4CC9F0" }}>VALIDATED PERFORMANCE</div>
            <h3 className="text-2xl font-bold mb-6">Proven Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { metric: "Grip Success Rate", value: "90%", detail: "9/10 pin transports" },
                { metric: "Average Match Score", value: "99.2 pts", detail: "Feb 8 qualifier" },
                { metric: "VR Skills Score", value: "140 pts", detail: "Final season score" },
              ].map((perf, idx) => (
                <div key={idx} className="p-4 border text-center" style={{ borderColor: "rgba(76,201,240,0.15)" }}>
                  <div className="label-mono text-xs mb-2" style={{ color: "#4CC9F0" }}>{perf.metric}</div>
                  <div className="text-3xl font-extrabold mb-1">{perf.value}</div>
                  <div className="text-xs text-white/60">{perf.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPETITION ── */}
      <section
        ref={(el) => { sectionRefs.current[6] = el; }}
        id="competition"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(251,133,0,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#FB8500" }} />
            <SectionTag color="#FB8500">CHAPTER 05</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#FB8500" }}>Competition Results</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            From our first match to the Ontario Provincial Championship — performance data and lessons learned.
          </p>

          {/* Innovate Award Highlight */}
          <div className="mb-10 p-8 border-2 relative overflow-hidden" style={{ borderColor: "#FB8500", background: "linear-gradient(135deg, rgba(251,133,0,0.1), rgba(13,27,42,0.8))" }}>
            <div className="absolute top-4 right-6 text-6xl opacity-20">🏆</div>
            <div className="label-mono text-xs mb-2" style={{ color: "#FB8500" }}>NOV 2, 2025 — CAUTION TAPE HALLOWEEN QUALIFIER
FEB 8, 2026 — CAUTION TAPE LUNAR NEW YEAR QUALIFIER</div>
            <div className="text-4xl font-extrabold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>INNOVATE AWARD</div>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 600 }}>
              Recognized for our <strong>sensor-driven automation system</strong> that uses a distance sensor to automatically control the claw arm — eliminating manual button presses and reducing driver cognitive load.
            </p>
          </div>

          {/* Competition Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="p-5 border" style={{ borderColor: "rgba(251,133,0,0.2)", background: "rgba(251,133,0,0.04)" }}>
              <div className="label-mono text-xs mb-4" style={{ color: "#FB8500" }}>AVERAGE SCORE BY EVENT</div>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitionData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="event" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'Space Mono', monospace" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'Space Mono', monospace" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0D1B2A", border: "1px solid rgba(251,133,0,0.3)", fontFamily: "'Space Mono', monospace", fontSize: 12 }} />
                    <Bar dataKey="avg" fill="#FB8500" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lessons Learned */}
            <div className="p-5 border" style={{ borderColor: "rgba(251,133,0,0.2)", background: "rgba(251,133,0,0.04)" }}>
              <div className="label-mono text-xs mb-4" style={{ color: "#FB8500" }}>TACTICAL LESSONS LEARNED</div>
              <div className="space-y-4">
                {[
                  { icon: "🔭", title: "Scouting Matters", desc: "Observing other teams helps predict alliance performance." },
                  { icon: "🎲", title: "Alliance Variability", desc: "Scores vary greatly depending on partner strength." },
                  { icon: "📋", title: "Inspection is Critical", desc: "Proper preparation prevents disqualification risks." },
                  { icon: "🤝", title: "Teamwork is Key", desc: "Supporting your alliance partner is as important as driving." },
                ].map((l) => (
                  <div key={l.title} className="flex gap-3">
                    <span className="text-xl">{l.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{l.title}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Competition Events */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { date: "Nov 2", name: "Caution Tape Halloween Qualifier", avg: 39.4, skills: 2, award: "Innovate Award" },
              { date: "Nov 15", name: "Brampton Mix & Match", avg: 88.2, note: "Supporting 31200A" },
              { date: "Jan 17", name: "Brampton Mix & Match", avg: 68.7, note: "Supporting 31200A" },
              { date: "Feb 8", name: "Caution Tape Lunar New Year Qualifier", avg: 99.2, skills: 60, award: "Innovate Award" },
            ].map((event) => (
              <div key={event.date} className="p-5 border" style={{ borderColor: "rgba(251,133,0,0.25)", background: "rgba(251,133,0,0.05)" }}>
                <div className="label-mono text-xs mb-2" style={{ color: "#FB8500" }}>{event.date}</div>
                <div className="font-bold mb-3" style={{ fontSize: "14px" }}>{event.name}</div>
                <div className="space-y-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {event.avg && <div>Average Score: <strong>{event.avg}</strong></div>}
                  {event.skills && <div>Skills: <strong>{event.skills} pts</strong></div>}
                  {event.award && <div style={{ color: "#FB8500", fontWeight: "bold" }}>{event.award}</div>}
                  {event.note && <div style={{ color: "#FFB703", fontStyle: "italic" }}>{event.note}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* U.S. Open Invitation */}
          <div className="p-6 border" style={{ borderColor: "rgba(251,133,0,0.3)", background: "rgba(251,133,0,0.06)" }}>
            <div className="flex items-start gap-6">
              <div className="text-5xl flex-shrink-0">✏️</div>
              <div>
                <div className="label-mono text-xs mb-1" style={{ color: "#FB8500" }}>ACHIEVEMENT UNLOCKED</div>
                <h3 className="text-2xl font-bold mb-2">CREATE U.S. Open Robotics Championship</h3>
                <div className="flex flex-wrap gap-4 mb-3">
                  <span className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>📅 March 26–28, 2026</span>
                  <span className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>📍 Council Bluffs, Iowa</span>
                  <span className="label-mono text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>🏟 Iowa West Field House</span>
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  An official invitation to one of North America's premier VEX IQ events — received early in our very first season. This recognition validated our innovative approach and hard work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEASON TIMELINE ── */}
      <section
        ref={(el) => { sectionRefs.current[7] = el; }}
        id="season"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(76,201,240,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#4CC9F0" }} />
            <SectionTag color="#4CC9F0">CHAPTER 06</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#4CC9F0" }}>Full Season Journey</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            From registration to the World Championship — every milestone on our path.
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, #FFB703, #4CC9F0, #06D6A0)" }} />

            <div className="space-y-8 pl-16">
              {seasonEvents.map((ev, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div
                    className="absolute -left-10 top-1 w-4 h-4 border-2 rotate-45"
                    style={{
                      borderColor: ev.color,
                      background: ev.type === "goal" ? ev.color : "#0D1B2A",
                      boxShadow: `0 0 10px ${ev.color}60`,
                    }}
                  />
                  <div className="p-4 border" style={{ borderColor: `${ev.color}20`, background: `${ev.color}06`, borderLeft: `3px solid ${ev.color}` }}>
                    <div className="label-mono text-xs mb-1" style={{ color: ev.color }}>{ev.date}</div>
                    <div className="font-semibold text-base whitespace-pre-line">{ev.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Schedule */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border" style={{ borderColor: "rgba(76,201,240,0.2)", borderLeft: "4px solid #4CC9F0" }}>
              <div className="label-mono text-xs mb-2" style={{ color: "#4CC9F0" }}>TEAM PRACTICE</div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                Teams 31200A and 31200K meet every <strong>Sunday for 2 hours</strong> to build, practice, and collaborate as one big family.
              </p>
            </div>
            <div className="p-5 border" style={{ borderColor: "rgba(6,214,160,0.2)", borderLeft: "4px solid #06D6A0" }}>
              <div className="label-mono text-xs mb-2" style={{ color: "#06D6A0" }}>OUR GOAL</div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                To represent Ontario with pride at the <strong>World Championship in May 2026</strong> — and prove that intelligence wins.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div>
              <div className="text-2xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FFB703" }}>INTELLIGENCE WINS</div>
              <div className="label-mono text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>TEAM 31200K · ONTARIO, CANADA · 2025–2026</div>
            </div>
            <div className="label-mono text-xs text-right" style={{ color: "rgba(255,255,255,0.25)" }}>
              VEX IQ MIX & MATCH<br />ENGINEERING NOTEBOOK
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM MANAGER ── */}
      <section
        ref={(el) => { sectionRefs.current[8] = el; }}
        id="team-manager"
        className="min-h-screen py-24"
        style={{ borderTop: "1px solid rgba(155,93,229,0.2)" }}
      >
        <div className="container max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border-2 rotate-45" style={{ borderColor: "#9B5DE5" }} />
            <SectionTag color="#9B5DE5">TEAM LEADERSHIP</SectionTag>
          </div>
          <h2 className="text-5xl font-extrabold mb-3" style={{ color: "#9B5DE5" }}>Team Manager</h2>
          <p className="text-base mb-12" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 600 }}>
            Comprehensive team management, meeting logs, and season planning documentation.
          </p>

          {/* Season Schedule */}
          <div className="mb-12 p-8 border" style={{ borderColor: "rgba(155,93,229,0.2)", background: "rgba(155,93,229,0.04)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>SEASON TIMELINE</div>
            <h3 className="text-2xl font-bold mb-6">Mix & Match Season Schedule 2025-2026</h3>
            <div className="space-y-4">
              {[
                { phase: "Team Registration", timeline: "June - July 2025", desc: "Official team registration and preparation" },
                { phase: "Team Preparation", timeline: "July - August 2025", desc: "Initial planning and resource gathering" },
                { phase: "Team Meeting, Robotics Building & Programming", timeline: "September 2025 - February 2026", desc: "Core development phase with weekly meetings" },
                { phase: "Research & Prototyping", timeline: "September - October 2025", desc: "Design exploration and initial prototypes" },
                { phase: "Competition Season", timeline: "November 2025 - February 2026", desc: "Four qualifier events across Ontario" },
                { phase: "Provincial Championship", timeline: "March 7-8, 2026", desc: "Qualification achieved - competing for provincial title" },
                { phase: "World Championship", timeline: "May 2026", desc: "Target milestone - representing Ontario globally" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 border" style={{ borderColor: "rgba(155,93,229,0.15)", background: "rgba(155,93,229,0.03)" }}>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="font-semibold" style={{ color: "#9B5DE5" }}>{item.phase}</div>
                    <div className="label-mono text-xs text-white/60">{item.timeline}</div>
                  </div>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Meeting Log */}
          <div className="p-8 border" style={{ borderColor: "rgba(155,93,229,0.2)", background: "rgba(155,93,229,0.04)" }}>
            <div className="label-mono text-xs mb-4" style={{ color: "#9B5DE5" }}>TEAM COORDINATION</div>
            <h3 className="text-2xl font-bold mb-6">Team Meeting Log</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
              Teams 31200K and 31200A meet every <strong>Sunday for 2 hours</strong> to build, practice, and work as one big team. Below is a comprehensive log of all team meetings throughout the season.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(155,93,229,0.3)" }}>
                    <th className="text-left p-3" style={{ color: "#9B5DE5" }}>Date</th>
                    <th className="text-left p-3" style={{ color: "#9B5DE5" }}>Matthew</th>
                    <th className="text-left p-3" style={{ color: "#9B5DE5" }}>Ray</th>
                    <th className="text-left p-3" style={{ color: "#9B5DE5" }}>Chen</th>
                    <th className="text-left p-3" style={{ color: "#9B5DE5" }}>Liam</th>
                    <th className="text-left p-3" style={{ color: "#9B5DE5" }}>Meeting Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: "2025-09-07", matthew: "✓", ray: "✓", chen: "-", liam: "✓", notes: "Kickoff meeting, vote for team name" },
                    { date: "2025-09-14", matthew: "✓", ray: "✓", chen: "◐", liam: "✓", notes: "Game strategy analysis, field setup" },
                    { date: "2025-09-21", matthew: "-", ray: "✓", chen: "✓", liam: "✓", notes: "Brainstorming, Prototyping; programming environment setup" },
                    { date: "2025-09-28", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Drive train analysis and building; programming learning" },
                    { date: "2025-10-05", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Drive train building, Claw & Clamp initial design; controller pairing" },
                    { date: "2025-10-12", matthew: "✓", ray: "✓", chen: "-", liam: "-", notes: "First drive testing" },
                    { date: "2025-10-19", matthew: "✓", ray: "✓", chen: "✓", liam: "-", notes: "Drive practicing" },
                    { date: "2025-10-26", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Competition rule learning, auto skills programming" },
                    { date: "2025-11-02", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "K team's competition (CautionTape)" },
                    { date: "2025-11-09", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "CautionTape competition reflection" },
                    { date: "2025-11-23", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Drive testing; VR skills training" },
                    { date: "2025-11-30", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "2nd field setup; VR skills" },
                    { date: "2025-12-07", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Building improvement; new Robot brainstorming (Revolver)" },
                    { date: "2025-12-14", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "new Robot building; VR skills" },
                    { date: "2026-01-11", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Drive practice, interview practice" },
                    { date: "2026-01-17", matthew: "-", ray: "-", chen: "-", liam: "-", notes: "Support A team's competition (Brampton)" },
                    { date: "2026-02-01", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Brampton competition reflection; new Robot building" },
                    { date: "2026-02-08", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "Both A & K team's competition (CautionTape)" },
                    { date: "2026-02-15", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "CautionTape competition reflection, support K team drive practice" },
                    { date: "2026-02-22", matthew: "✓", ray: "✓", chen: "✓", liam: "✓", notes: "drive practice, decision for new Robot" },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(155,93,229,0.1)" }}>
                      <td className="p-3 label-mono text-xs" style={{ color: "#9B5DE5" }}>{row.date}</td>
                      <td className="p-3 text-center">{row.matthew}</td>
                      <td className="p-3 text-center">{row.ray}</td>
                      <td className="p-3 text-center">{row.chen}</td>
                      <td className="p-3 text-center">{row.liam}</td>
                      <td className="p-3 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              <p><strong>Legend:</strong> ✓ = Present | ◐ = Partial | - = Absent</p>
            </div>
          </div>

          {/* Team Insights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border" style={{ borderColor: "rgba(155,93,229,0.2)", background: "rgba(155,93,229,0.04)" }}>
              <div className="label-mono text-xs mb-3" style={{ color: "#9B5DE5" }}>TEAM COMMITMENT</div>
              <h4 className="font-semibold mb-3">Attendance & Dedication</h4>
              <p className="text-sm text-white/70 mb-3">
                All four team members demonstrated exceptional commitment with near-perfect attendance throughout the season. The team prioritized consistency and collaboration.
              </p>
              <div className="space-y-2 text-sm">
                <div>🎯 <strong>20 meetings attended</strong> (Sep-Feb)</div>
                <div>📅 <strong>Weekly Sunday meetings</strong> for 2 hours</div>
                <div>🤝 <strong>Collaborative approach</strong> with sister team 31200A</div>
              </div>
            </div>
            <div className="p-6 border" style={{ borderColor: "rgba(155,93,229,0.2)", background: "rgba(155,93,229,0.04)" }}>
              <div className="label-mono text-xs mb-3" style={{ color: "#9B5DE5" }}>TEAM STRUCTURE</div>
              <h4 className="font-semibold mb-3">Roles & Responsibilities</h4>
              <p className="text-sm text-white/70 mb-3">
                Clear role definition and cross-functional collaboration enabled efficient project execution and continuous improvement.
              </p>
              <div className="space-y-2 text-sm">
                <div>🎮 <strong>Matthew Lin</strong> - Driver & Builder</div>
                <div>💻 <strong>Ray Zhao</strong> - Driver & Programmer</div>
                <div>🔧 <strong>Liam Qian</strong> - Builder</div>
                <div>📖 <strong>Chen Li</strong> - Builder & Notebooker</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
