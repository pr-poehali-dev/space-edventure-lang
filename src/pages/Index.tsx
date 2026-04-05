import { useState } from "react";

type Planet = {
  id: string;
  name: string;
  topic: string;
  color: string;
  glow: string;
  icon: string;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  x: string;
  y: string;
};

type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
};

const PLANETS: Planet[] = [
  { id: "articles", name: "Планета Артиклей", topic: "Articles: a, an, the", icon: "📖", color: "#4FC3F7", glow: "#4FC3F7", unlocked: true, completed: true, stars: 3, x: "18%", y: "22%" },
  { id: "present-simple", name: "Планета Времени", topic: "Present Simple", icon: "⏱️", color: "#FFD54F", glow: "#FFB300", unlocked: true, completed: true, stars: 2, x: "60%", y: "14%" },
  { id: "questions", name: "Планета Вопросов", topic: "Question Words", icon: "❓", color: "#CE93D8", glow: "#AB47BC", unlocked: true, completed: false, stars: 0, x: "80%", y: "30%" },
  { id: "sports", name: "Планета Спорта", topic: "Sports Vocabulary", icon: "⚽", color: "#A5D6A7", glow: "#43A047", unlocked: true, completed: false, stars: 0, x: "85%", y: "58%" },
  { id: "jobs", name: "Планета Профессий", topic: "Jobs & Professions", icon: "👷", color: "#FFCC80", glow: "#FB8C00", unlocked: false, completed: false, stars: 0, x: "62%", y: "74%" },
  { id: "appearance", name: "Планета Внешности", topic: "Appearance", icon: "💄", color: "#F48FB1", glow: "#E91E63", unlocked: false, completed: false, stars: 0, x: "35%", y: "80%" },
  { id: "character", name: "Планета Характера", topic: "Character & Traits", icon: "🧠", color: "#EF9A9A", glow: "#E53935", unlocked: false, completed: false, stars: 0, x: "12%", y: "64%" },
  { id: "home", name: "Финальная Планета", topic: "Mission Complete! 🎉", icon: "🌍", color: "#80DEEA", glow: "#00BCD4", unlocked: false, completed: false, stars: 0, x: "10%", y: "40%" },
];

const BADGES: Badge[] = [
  { id: "first-star", name: "Первая звезда", emoji: "⭐", description: "Получи первую звезду", earned: true },
  { id: "article-master", name: "Мастер артиклей", emoji: "📚", description: "Пройди планету артиклей", earned: true },
  { id: "time-wizard", name: "Волшебник времени", emoji: "⏰", description: "Пройди Present Simple", earned: true },
  { id: "question-hero", name: "Герой вопросов", emoji: "❓", description: "Пройди планету вопросов", earned: false },
  { id: "sport-champ", name: "Чемпион спорта", emoji: "🏆", description: "Пройди спортивную планету", earned: false },
  { id: "explorer", name: "Исследователь", emoji: "🚀", description: "Открой 5 планет", earned: false },
];

function StarRating({ stars, max = 3 }: { stars: number; max?: number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ opacity: i < stars ? 1 : 0.25, filter: i < stars ? "drop-shadow(0 0 4px #FFD700)" : "grayscale(1)" }} className="text-base">⭐</span>
      ))}
    </div>
  );
}

function Stars() {
  const stars = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    dur: Math.random() * 3 + 2,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationName: "twinkle", animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`, animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<"map" | "progress">("map");
  const [selected, setSelected] = useState<Planet | null>(null);

  const totalStars = PLANETS.reduce((s, p) => s + p.stars, 0);
  const completedCount = PLANETS.filter((p) => p.completed).length;
  const badgesEarned = BADGES.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #050510 0%, #0d1440 35%, #190d40 65%, #071428 100%)", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:1;transform:scale(1.8)} }
        @keyframes floatY { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
        @keyframes popIn { from{opacity:0;transform:scale(.85) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes shimmer { 0%,100%{box-shadow:0 0 18px var(--glow),0 0 40px var(--glow2)} 50%{box-shadow:0 0 30px var(--glow),0 0 60px var(--glow2)} }
        .float-anim { animation: floatY 4s ease-in-out infinite; }
        .float-slow { animation: floatY 6s ease-in-out infinite; }
        .pop-in { animation: popIn .35s cubic-bezier(.34,1.56,.64,1) forwards; }
        .planet-btn:hover > div { transform: scale(1.12); }
        .planet-btn > div { transition: transform .25s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-4 py-2.5" style={{ background: "rgba(5,5,20,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl float-anim inline-block">🚀</span>
          <span className="font-black text-white text-lg tracking-wide" style={{ fontFamily: "'Russo One', sans-serif", letterSpacing: "0.05em" }}>Space English</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)" }}>
            <span className="text-xs">⭐</span>
            <span className="text-xs font-black" style={{ color: "#FFD700" }}>{totalStars}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
            <span className="text-xs">🏆</span>
            <span className="text-xs font-black" style={{ color: "#A78BFA" }}>{badgesEarned}</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: "linear-gradient(135deg, #f97316, #ec4899)", border: "2px solid rgba(255,255,255,0.25)" }}>А</div>
        </div>
      </header>

      {/* TABS */}
      <div className="relative z-20 flex justify-center gap-2 pt-3 px-4">
        {(["map", "progress"] as const).map((p) => (
          <button key={p} onClick={() => setPage(p)} className="px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-200" style={{ background: page === p ? "white" : "rgba(255,255,255,0.1)", color: page === p ? "#1e1b4b" : "rgba(255,255,255,0.65)", boxShadow: page === p ? "0 4px 16px rgba(255,255,255,0.2)" : "none" }}>
            {p === "map" ? "🗺️ Карта мира" : "🏆 Мой прогресс"}
          </button>
        ))}
      </div>

      {/* MAP */}
      {page === "map" && (
        <div className="relative" style={{ height: "calc(100vh - 112px)" }}>
          <Stars />

          {/* Nebula decorations */}
          <div className="absolute pointer-events-none" style={{ top: "15%", left: "20%", width: 280, height: 280, background: "radial-gradient(circle, rgba(99,40,200,.16) 0%, transparent 70%)", filter: "blur(45px)" }} />
          <div className="absolute pointer-events-none" style={{ bottom: "25%", right: "20%", width: 320, height: 320, background: "radial-gradient(circle, rgba(40,100,220,.13) 0%, transparent 70%)", filter: "blur(55px)" }} />
          <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", width: 400, height: 300, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(180,40,120,.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

          {/* Orbit rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
            <ellipse cx="50%" cy="48%" rx="38%" ry="28%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 7" />
            <ellipse cx="50%" cy="48%" rx="22%" ry="16%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="7 9" />
          </svg>

          {/* Planets */}
          {PLANETS.map((planet) => {
            const size = planet.id === "home" ? 88 : 72;
            return (
              <button
                key={planet.id}
                className="planet-btn absolute focus:outline-none"
                style={{ left: planet.x, top: planet.y, transform: "translate(-50%, -50%)" }}
                onClick={() => setSelected(planet)}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <div
                      className="rounded-full flex items-center justify-center text-2xl"
                      style={{
                        width: size, height: size,
                        background: planet.unlocked
                          ? `radial-gradient(circle at 32% 32%, rgba(255,255,255,0.85) 0%, ${planet.color} 35%, ${planet.color}bb 100%)`
                          : "radial-gradient(circle, #2a2a4a, #1a1a3a)",
                        boxShadow: planet.unlocked ? `0 0 22px ${planet.glow}55, 0 0 50px ${planet.glow}22, inset 0 -8px 16px rgba(0,0,0,0.25)` : "0 0 8px rgba(0,0,0,0.5)",
                        border: planet.unlocked ? `2px solid ${planet.color}88` : "2px solid rgba(255,255,255,0.1)",
                        filter: planet.unlocked ? "none" : "grayscale(0.8) brightness(0.5)",
                      }}
                    >
                      {planet.unlocked ? planet.icon : "🔒"}
                    </div>
                    {planet.completed && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: "#22c55e", border: "2px solid white" }}>✓</div>
                    )}
                  </div>
                  <div className="text-center" style={{ maxWidth: 90 }}>
                    <div className="text-xs font-black text-white px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{planet.name.split(" ").slice(-1)[0]}</div>
                    {planet.unlocked && <StarRating stars={planet.stars} />}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Mascot */}
          <div className="absolute pointer-events-none float-slow" style={{ bottom: "6%", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div className="text-5xl">👨‍🚀</div>
            <div className="mt-1 text-xs font-bold text-white/60 rounded-full px-3 py-0.5" style={{ background: "rgba(0,0,0,0.45)" }}>Космонавт Алёша</div>
          </div>

          {/* Planet Modal */}
          {selected && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-5" style={{ background: "rgba(0,0,0,0.72)" }} onClick={() => setSelected(null)}>
              <div className="pop-in relative w-full max-w-sm rounded-3xl p-6 text-center" style={{ background: "linear-gradient(160deg, #12123a, #1e1060)", border: "2px solid rgba(255,255,255,0.15)", boxShadow: `0 0 70px ${selected.glow}44, 0 20px 60px rgba(0,0,0,0.6)` }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelected(null)} className="absolute top-3 right-4 text-xl font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>✕</button>

                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: `radial-gradient(circle at 32% 32%, rgba(255,255,255,0.85) 0%, ${selected.color} 35%, ${selected.color}99 100%)`, boxShadow: `0 0 35px ${selected.glow}99, inset 0 -8px 16px rgba(0,0,0,0.2)` }}>
                  {selected.icon}
                </div>

                <h2 className="text-xl font-black text-white mb-1">{selected.name}</h2>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{selected.topic}</p>

                {selected.unlocked && (
                  <div className="mb-4">
                    <StarRating stars={selected.stars} />
                  </div>
                )}

                {selected.unlocked ? (
                  <button className="w-full py-3 rounded-2xl font-black text-white text-base transition-all hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.glow})`, boxShadow: `0 6px 24px ${selected.glow}66`, color: "white", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                    {selected.completed ? "🔄 Играть снова" : "🚀 Начать!"}
                  </button>
                ) : (
                  <div className="py-3 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>🔒 Пройди предыдущие уровни</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {page === "progress" && (
        <div className="overflow-y-auto" style={{ height: "calc(100vh - 112px)" }}>
          <div className="relative">
            <Stars />
            <div className="relative z-10 p-4 max-w-lg mx-auto">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5 pt-2">
                {[
                  { label: "Звёзды", val: totalStars, max: PLANETS.length * 3, emoji: "⭐", clr: "#FFD700" },
                  { label: "Планеты", val: completedCount, max: PLANETS.length, emoji: "🪐", clr: "#A78BFA" },
                  { label: "Бейджи", val: badgesEarned, max: BADGES.length, emoji: "🏅", clr: "#34D399" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="text-2xl">{s.emoji}</div>
                    <div className="text-xl font-black mt-0.5" style={{ color: s.clr }}>{s.val}</div>
                    <div className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(s.val / s.max) * 100}%`, background: s.clr, transition: "width 1s" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall */}
              <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-white">Общий прогресс</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{Math.round((completedCount / PLANETS.length) * 100)}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(completedCount / PLANETS.length) * 100}%`, background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)", transition: "width 1s" }} />
                </div>
              </div>

              {/* Planets list */}
              <h3 className="font-black text-white mb-3">🪐 Планеты</h3>
              <div className="space-y-2 mb-5">
                {PLANETS.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: p.unlocked ? `${p.color}25` : "rgba(255,255,255,0.04)", border: `2px solid ${p.unlocked ? p.color + "88" : "rgba(255,255,255,0.1)"}` }}>
                      {p.unlocked ? p.icon : "🔒"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{p.name}</div>
                      <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{p.topic}</div>
                    </div>
                    {p.unlocked ? <StarRating stars={p.stars} /> : <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Закрыто</span>}
                  </div>
                ))}
              </div>

              {/* Badges */}
              <h3 className="font-black text-white mb-3">🏆 Бейджи и достижения</h3>
              <div className="grid grid-cols-2 gap-3 pb-8">
                {BADGES.map((badge) => (
                  <div key={badge.id} className="rounded-xl p-3 flex items-center gap-2.5" style={{ background: badge.earned ? "rgba(255,215,0,0.09)" : "rgba(255,255,255,0.04)", border: badge.earned ? "1px solid rgba(255,215,0,0.28)" : "1px solid rgba(255,255,255,0.07)", opacity: badge.earned ? 1 : 0.45, filter: badge.earned ? "none" : "grayscale(0.5)" }}>
                    <span className="text-2xl">{badge.emoji}</span>
                    <div>
                      <div className="text-xs font-black text-white">{badge.name}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
