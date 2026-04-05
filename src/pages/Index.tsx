import { useState, useEffect } from "react";

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

type Question = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  hint?: string;
};

const QUESTIONS: Record<string, Question[]> = {
  articles: [
    { id: "a1", text: "Выбери правильный артикль: ___ apple a day keeps the doctor away.", options: ["a", "an", "the", "-"], correct: 1, hint: "Перед гласной 'a' используется 'an'" },
    { id: "a2", text: "Вставь артикль: I have ___ dog. ___ dog is very friendly.", options: ["a / The", "the / A", "an / The", "a / A"], correct: 0, hint: "Первое упоминание — 'a', повторное — 'the'" },
    { id: "a3", text: "Артикль перед словом 'university':", options: ["an university", "a university", "the university", "university"], correct: 1, hint: "'University' начинается со звука [j], поэтому 'a'" },
    { id: "a4", text: "Выбери верное предложение:", options: ["She is a best student", "She is the best student", "She is an best student", "She is best student"], correct: 1, hint: "С превосходной степенью используется 'the'" },
    { id: "a5", text: "___ Sun rises in the east.", options: ["A", "An", "The", "-"], correct: 2, hint: "Единственные в своём роде объекты — с артиклем 'the'" },
  ],
  "present-simple": [
    { id: "ps1", text: "Выбери правильную форму: She ___ to school every day.", options: ["go", "goes", "going", "gone"], correct: 1, hint: "С he/she/it добавляем -s" },
    { id: "ps2", text: "Как правильно задать вопрос?", options: ["Does he plays tennis?", "Do he play tennis?", "Does he play tennis?", "Is he play tennis?"], correct: 2, hint: "С does глагол остаётся в базовой форме" },
    { id: "ps3", text: "Отрицание: They ___ like coffee.", options: ["doesn't", "don't", "isn't", "aren't"], correct: 1, hint: "С they/we/I/you используется don't" },
    { id: "ps4", text: "Present Simple используется для:", options: ["Действий прямо сейчас", "Привычек и фактов", "Завершённых действий", "Будущих планов"], correct: 1, hint: "Every day, usually, always — подсказки Present Simple" },
    { id: "ps5", text: "Выбери правильное: My cat ___ fish.", options: ["love", "loves", "is love", "loving"], correct: 1, hint: "Кошка — 3-е лицо единственное число" },
  ],
  questions: [
    { id: "q1", text: "Как спросить о возрасте?", options: ["How old are you?", "What age you?", "How many age?", "Which old are you?"], correct: 0, hint: "How old = сколько лет" },
    { id: "q2", text: "Переведи: 'Откуда ты?'", options: ["Where are you?", "Where do you from?", "Where are you from?", "Where you from?"], correct: 2, hint: "Where + are you + from?" },
    { id: "q3", text: "___ is your favourite colour?", options: ["Who", "What", "Which", "How"], correct: 1, hint: "What — для предметов и вещей" },
    { id: "q4", text: "___ do you go to school? — By bus.", options: ["How", "What", "When", "Why"], correct: 0, hint: "How — спрашиваем о способе" },
    { id: "q5", text: "___ is your birthday? — In March.", options: ["What", "Where", "When", "Who"], correct: 2, hint: "When — спрашиваем о времени" },
  ],
  sports: [
    { id: "sp1", text: "Как по-английски 'плавание'?", options: ["Running", "Swimming", "Cycling", "Skiing"], correct: 1 },
    { id: "sp2", text: "Выбери правильный глагол: You ___ tennis.", options: ["do", "make", "play", "go"], correct: 2, hint: "С командными и мячовыми видами спорта — play" },
    { id: "sp3", text: "Как сказать 'заниматься йогой'?", options: ["play yoga", "do yoga", "go yoga", "make yoga"], correct: 1, hint: "С йогой, гимнастикой, боксом — do" },
    { id: "sp4", text: "Что значит 'to score a goal'?", options: ["Пропустить гол", "Забить гол", "Остановить гол", "Обсудить гол"], correct: 1 },
    { id: "sp5", text: "Выбери правильное: He ___ jogging every morning.", options: ["plays", "does", "goes", "makes"], correct: 2, hint: "С бегом, плаванием, лыжами — go" },
  ],
  jobs: [
    { id: "j1", text: "Кто такой 'a surgeon'?", options: ["Учитель", "Хирург", "Юрист", "Инженер"], correct: 1 },
    { id: "j2", text: "Как по-английски 'пожарный'?", options: ["Policeman", "Firefighter", "Lifeguard", "Soldier"], correct: 1 },
    { id: "j3", text: "Переведи: 'He is an architect.'", options: ["Он актёр", "Он архитектор", "Он бухгалтер", "Он агроном"], correct: 1 },
    { id: "j4", text: "Выбери правильный вопрос: '___ do you do?'", options: ["How", "Where", "What", "Who"], correct: 2, hint: "What do you do? = Кем ты работаешь?" },
    { id: "j5", text: "A person who takes care of sick people in a hospital:", options: ["Teacher", "Nurse", "Driver", "Chef"], correct: 1 },
  ],
  appearance: [
    { id: "ap1", text: "Как по-английски 'кудрявые волосы'?", options: ["straight hair", "curly hair", "long hair", "short hair"], correct: 1 },
    { id: "ap2", text: "Что значит 'slim'?", options: ["Высокий", "Стройный", "Мускулистый", "Полный"], correct: 1 },
    { id: "ap3", text: "Выбери правильное описание глаз:", options: ["blue hairs", "blue eyes", "blue face", "blue skin"], correct: 1 },
    { id: "ap4", text: "Как сказать 'У него борода'?", options: ["He has a moustache", "He has a beard", "He has freckles", "He has dimples"], correct: 1 },
    { id: "ap5", text: "Что значит 'She has a pale complexion'?", options: ["Тёмная кожа", "Бледная кожа", "Веснушки", "Загар"], correct: 1 },
  ],
  character: [
    { id: "ch1", text: "Что значит 'generous'?", options: ["Жадный", "Щедрый", "Грустный", "Умный"], correct: 1 },
    { id: "ch2", text: "Антоним слова 'brave':", options: ["Honest", "Kind", "Cowardly", "Silly"], correct: 2, hint: "Brave = храбрый, антоним = трусливый" },
    { id: "ch3", text: "Как по-английски 'надёжный'?", options: ["Lazy", "Reliable", "Arrogant", "Stubborn"], correct: 1 },
    { id: "ch4", text: "She always tells the truth. She is very ___.", options: ["honest", "selfish", "rude", "bossy"], correct: 0 },
    { id: "ch5", text: "Что значит 'He is outgoing'?", options: ["Он застенчивый", "Он общительный", "Он грубый", "Он умный"], correct: 1 },
  ],
  home: [
    { id: "h1", text: "Articles: ___ Eiffel Tower is in Paris.", options: ["A", "An", "The", "-"], correct: 2 },
    { id: "h2", text: "Present Simple: Water ___ at 100°C.", options: ["boil", "boils", "boiling", "is boil"], correct: 1 },
    { id: "h3", text: "___ is the capital of England?", options: ["Where", "What", "Which", "Who"], correct: 1 },
    { id: "h4", text: "He ___ basketball every weekend.", options: ["goes", "does", "plays", "makes"], correct: 2 },
    { id: "h5", text: "A person who designs buildings:", options: ["Nurse", "Architect", "Chef", "Pilot"], correct: 1 },
  ],
};

const INITIAL_PLANETS: Planet[] = [
  { id: "articles", name: "Планета Артиклей", topic: "Articles: a, an, the", icon: "📖", color: "#4FC3F7", glow: "#4FC3F7", unlocked: true, completed: false, stars: 0, x: "18%", y: "22%" },
  { id: "present-simple", name: "Планета Времени", topic: "Present Simple", icon: "⏱️", color: "#FFD54F", glow: "#FFB300", unlocked: true, completed: false, stars: 0, x: "60%", y: "14%" },
  { id: "questions", name: "Планета Вопросов", topic: "Question Words", icon: "❓", color: "#CE93D8", glow: "#AB47BC", unlocked: true, completed: false, stars: 0, x: "80%", y: "30%" },
  { id: "sports", name: "Планета Спорта", topic: "Sports Vocabulary", icon: "⚽", color: "#A5D6A7", glow: "#43A047", unlocked: true, completed: false, stars: 0, x: "85%", y: "58%" },
  { id: "jobs", name: "Планета Профессий", topic: "Jobs & Professions", icon: "👷", color: "#FFCC80", glow: "#FB8C00", unlocked: true, completed: false, stars: 0, x: "62%", y: "74%" },
  { id: "appearance", name: "Планета Внешности", topic: "Appearance", icon: "💄", color: "#F48FB1", glow: "#E91E63", unlocked: true, completed: false, stars: 0, x: "35%", y: "80%" },
  { id: "character", name: "Планета Характера", topic: "Character & Traits", icon: "🧠", color: "#EF9A9A", glow: "#E53935", unlocked: true, completed: false, stars: 0, x: "12%", y: "64%" },
  { id: "home", name: "Финальная Планета", topic: "Mission Complete! 🎉", icon: "🌍", color: "#80DEEA", glow: "#00BCD4", unlocked: true, completed: false, stars: 0, x: "10%", y: "40%" },
];

const INITIAL_BADGES: Badge[] = [
  { id: "first-star", name: "Первая звезда", emoji: "⭐", description: "Получи первую звезду", earned: false },
  { id: "article-master", name: "Мастер артиклей", emoji: "📚", description: "Пройди планету артиклей", earned: false },
  { id: "time-wizard", name: "Волшебник времени", emoji: "⏰", description: "Пройди Present Simple", earned: false },
  { id: "question-hero", name: "Герой вопросов", emoji: "❓", description: "Пройди планету вопросов", earned: false },
  { id: "sport-champ", name: "Чемпион спорта", emoji: "🏆", description: "Пройди спортивную планету", earned: false },
  { id: "explorer", name: "Исследователь", emoji: "🚀", description: "Пройди 5 планет", earned: false },
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

function BackgroundStars() {
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
        <div key={s.id} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationName: "twinkle", animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`, animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" }} />
      ))}
    </div>
  );
}

type GameState = {
  planetId: string;
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  showResult: boolean;
  selectedOption: number | null;
  showHint: boolean;
};

function GameScreen({ planet, onFinish }: { planet: Planet; onFinish: (stars: number) => void }) {
  const questions = QUESTIONS[planet.id] || [];
  const [state, setState] = useState<GameState>({
    planetId: planet.id,
    questions,
    currentIndex: 0,
    answers: Array(questions.length).fill(null),
    showResult: false,
    selectedOption: null,
    showHint: false,
  });

  const current = questions[state.currentIndex];
  const isLast = state.currentIndex === questions.length - 1;
  const correctCount = state.answers.filter((a, i) => a === questions[i].correct).length;

  function selectOption(idx: number) {
    if (state.selectedOption !== null) return;
    setState((s) => ({ ...s, selectedOption: idx }));
  }

  function next() {
    const newAnswers = [...state.answers];
    newAnswers[state.currentIndex] = state.selectedOption;

    if (isLast) {
      const correct = newAnswers.filter((a, i) => a === questions[i].correct).length;
      const stars = correct >= 5 ? 3 : correct >= 3 ? 2 : correct >= 1 ? 1 : 0;
      setState((s) => ({ ...s, answers: newAnswers, showResult: true }));
      setTimeout(() => onFinish(stars), 0);
      return;
    }
    setState((s) => ({ ...s, answers: newAnswers, currentIndex: s.currentIndex + 1, selectedOption: null, showHint: false }));
  }

  if (state.showResult) {
    const stars = correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : correctCount >= 1 ? 1 : 0;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: "rgba(0,0,0,0.9)" }}>
        <div className="pop-in w-full max-w-sm rounded-3xl p-8 text-center" style={{ background: "linear-gradient(160deg, #12123a, #1e1060)", border: "2px solid rgba(255,255,255,0.15)", boxShadow: `0 0 70px ${planet.glow}44` }}>
          <div className="text-6xl mb-4">{stars === 3 ? "🎉" : stars === 2 ? "😊" : stars >= 1 ? "👍" : "😅"}</div>
          <h2 className="text-2xl font-black text-white mb-2">{stars >= 2 ? "Отлично!" : stars === 1 ? "Неплохо!" : "Попробуй ещё раз!"}</h2>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Правильных ответов: {correctCount} из {questions.length}</p>
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="text-3xl" style={{ opacity: i < stars ? 1 : 0.2, filter: i < stars ? "drop-shadow(0 0 8px #FFD700)" : "none", transition: `opacity 0.3s ${i * 0.15}s` }}>⭐</span>
            ))}
          </div>
          <button onClick={() => onFinish(stars)} className="w-full py-3 rounded-2xl font-black text-white text-base" style={{ background: `linear-gradient(135deg, ${planet.color}, ${planet.glow})`, boxShadow: `0 6px 24px ${planet.glow}66` }}>
            🗺️ На карту
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "linear-gradient(160deg, #050510 0%, #0d1440 50%, #190d40 100%)" }}>
      <BackgroundStars />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3" style={{ background: "rgba(5,5,20,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={() => onFinish(-1)} className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
          ← Выйти
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">{planet.icon}</span>
          <span className="text-sm font-black text-white">{planet.name}</span>
        </div>
        <div className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>{state.currentIndex + 1}/{questions.length}</div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${((state.currentIndex) / questions.length) * 100}%`, background: `linear-gradient(90deg, ${planet.color}, ${planet.glow})` }} />
      </div>

      {/* Question */}
      <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="rounded-3xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: planet.color }}>Вопрос {state.currentIndex + 1}</div>
            <p className="text-white font-black text-lg leading-snug">{current.text}</p>
            {current.hint && (
              <button onClick={() => setState((s) => ({ ...s, showHint: !s.showHint }))} className="mt-3 text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                💡 {state.showHint ? "Скрыть подсказку" : "Подсказка"}
              </button>
            )}
            {state.showHint && current.hint && (
              <div className="mt-2 text-xs rounded-xl px-3 py-2" style={{ background: "rgba(255,215,0,0.1)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.2)" }}>
                {current.hint}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {current.options.map((opt, idx) => {
              const isSelected = state.selectedOption === idx;
              const isCorrect = idx === current.correct;
              const showAnswer = state.selectedOption !== null;

              let bg = "rgba(255,255,255,0.07)";
              let border = "1px solid rgba(255,255,255,0.12)";
              let textColor = "white";

              if (showAnswer) {
                if (isCorrect) { bg = "rgba(34,197,94,0.2)"; border = "1px solid rgba(34,197,94,0.6)"; textColor = "#4ade80"; }
                else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.2)"; border = "1px solid rgba(239,68,68,0.6)"; textColor = "#f87171"; }
              } else if (isSelected) {
                bg = `${planet.color}22`;
                border = `1px solid ${planet.color}88`;
              }

              return (
                <button key={idx} onClick={() => selectOption(idx)} className="w-full text-left rounded-2xl px-5 py-3.5 font-bold transition-all duration-200" style={{ background: bg, border, color: textColor, transform: isSelected ? "scale(1.02)" : "scale(1)" }}>
                  <span className="mr-3 text-sm opacity-60">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                  {showAnswer && isCorrect && <span className="float-right">✓</span>}
                  {showAnswer && isSelected && !isCorrect && <span className="float-right">✗</span>}
                </button>
              );
            })}
          </div>

          {state.selectedOption !== null && (
            <button onClick={next} className="w-full mt-5 py-3.5 rounded-2xl font-black text-white text-base transition-all hover:scale-105 active:scale-95 pop-in" style={{ background: `linear-gradient(135deg, ${planet.color}, ${planet.glow})`, boxShadow: `0 6px 24px ${planet.glow}66` }}>
              {isLast ? "🏆 Завершить!" : "Следующий →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<"map" | "progress">("map");
  const [selected, setSelected] = useState<Planet | null>(null);
  const [playing, setPlaying] = useState<Planet | null>(null);
  const [planets, setPlanets] = useState<Planet[]>(INITIAL_PLANETS);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);

  const totalStars = planets.reduce((s, p) => s + p.stars, 0);
  const completedCount = planets.filter((p) => p.completed).length;
  const badgesEarned = badges.filter((b) => b.earned).length;

  function startGame(planet: Planet) {
    setSelected(null);
    setPlaying(planet);
  }

  function finishGame(stars: number) {
    if (!playing) return;
    if (stars < 0) { setPlaying(null); return; }

    const planetId = playing.id;
    setPlanets((prev) =>
      prev.map((p) =>
        p.id === planetId
          ? { ...p, completed: true, stars: Math.max(p.stars, stars) }
          : p
      )
    );

    setBadges((prev) => {
      let next = [...prev];
      if (stars > 0) next = next.map((b) => b.id === "first-star" ? { ...b, earned: true } : b);
      if (planetId === "articles") next = next.map((b) => b.id === "article-master" ? { ...b, earned: true } : b);
      if (planetId === "present-simple") next = next.map((b) => b.id === "time-wizard" ? { ...b, earned: true } : b);
      if (planetId === "questions") next = next.map((b) => b.id === "question-hero" ? { ...b, earned: true } : b);
      if (planetId === "sports") next = next.map((b) => b.id === "sport-champ" ? { ...b, earned: true } : b);
      const doneCount = planets.filter((p) => p.id !== planetId ? p.completed : true).length;
      if (doneCount >= 5) next = next.map((b) => b.id === "explorer" ? { ...b, earned: true } : b);
      return next;
    });

    setPlaying(null);
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #050510 0%, #0d1440 35%, #190d40 65%, #071428 100%)", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:1;transform:scale(1.8)} }
        @keyframes floatY { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
        @keyframes popIn { from{opacity:0;transform:scale(.85) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .float-anim { animation: floatY 4s ease-in-out infinite; }
        .pop-in { animation: popIn .35s cubic-bezier(.34,1.56,.64,1) forwards; }
        .planet-btn:hover > div { transform: scale(1.12); }
        .planet-btn > div { transition: transform .25s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      {playing && <GameScreen planet={playing} onFinish={finishGame} />}

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
          <BackgroundStars />

          <div className="absolute pointer-events-none" style={{ top: "15%", left: "20%", width: 280, height: 280, background: "radial-gradient(circle, rgba(99,40,200,.16) 0%, transparent 70%)", filter: "blur(45px)" }} />
          <div className="absolute pointer-events-none" style={{ bottom: "25%", right: "20%", width: 320, height: 320, background: "radial-gradient(circle, rgba(40,100,220,.13) 0%, transparent 70%)", filter: "blur(55px)" }} />
          <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", width: 400, height: 300, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(180,40,120,.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
            <ellipse cx="50%" cy="48%" rx="38%" ry="28%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 7" />
            <ellipse cx="50%" cy="48%" rx="22%" ry="16%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="7 9" />
          </svg>

          {planets.map((planet) => {
            const size = planet.id === "home" ? 88 : 72;
            return (
              <button key={planet.id} className="planet-btn absolute focus:outline-none" style={{ left: planet.x, top: planet.y, transform: "translate(-50%, -50%)" }} onClick={() => setSelected(planet)}>
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <div className="rounded-full flex items-center justify-center text-2xl" style={{ width: size, height: size, background: `radial-gradient(circle at 32% 32%, rgba(255,255,255,0.85) 0%, ${planet.color} 35%, ${planet.color}bb 100%)`, boxShadow: `0 0 22px ${planet.glow}55, 0 0 50px ${planet.glow}22, inset 0 -8px 16px rgba(0,0,0,0.25)`, border: `2px solid ${planet.color}88` }}>
                      {planet.icon}
                    </div>
                    {planet.completed && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: "#22c55e", border: "2px solid white" }}>✓</div>
                    )}
                  </div>
                  <div className="text-center" style={{ maxWidth: 90 }}>
                    <div className="text-xs font-black text-white px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{planet.name.split(" ").slice(-1)[0]}</div>
                    <StarRating stars={planet.stars} />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Planet Modal */}
          {selected && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-5" style={{ background: "rgba(0,0,0,0.72)" }} onClick={() => setSelected(null)}>
              <div className="pop-in relative w-full max-w-sm rounded-3xl p-6 text-center" style={{ background: "linear-gradient(160deg, #12123a, #1e1060)", border: "2px solid rgba(255,255,255,0.15)", boxShadow: `0 0 70px ${selected.glow}44, 0 20px 60px rgba(0,0,0,0.6)` }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelected(null)} className="absolute top-3 right-4 text-xl font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>✕</button>

                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: `radial-gradient(circle at 32% 32%, rgba(255,255,255,0.85) 0%, ${selected.color} 35%, ${selected.color}99 100%)`, boxShadow: `0 0 35px ${selected.glow}99, inset 0 -8px 16px rgba(0,0,0,0.2)` }}>
                  {selected.icon}
                </div>

                <h2 className="text-xl font-black text-white mb-1">{selected.name}</h2>
                <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>{selected.topic}</p>

                <div className="mb-2 text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {QUESTIONS[selected.id]?.length || 0} вопросов
                </div>

                {selected.stars > 0 && (
                  <div className="mb-4">
                    <StarRating stars={selected.stars} />
                  </div>
                )}

                <button onClick={() => startGame(selected)} className="w-full py-3 rounded-2xl font-black text-white text-base transition-all hover:scale-105 active:scale-95" style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.glow})`, boxShadow: `0 6px 24px ${selected.glow}66`, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                  {selected.completed ? "🔄 Играть снова" : "🚀 Начать!"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {page === "progress" && (
        <div className="overflow-y-auto" style={{ height: "calc(100vh - 112px)" }}>
          <div className="relative">
            <BackgroundStars />
            <div className="relative z-10 p-4 max-w-lg mx-auto">
              <div className="grid grid-cols-3 gap-3 mb-5 pt-2">
                {[
                  { label: "Звёзды", val: totalStars, max: planets.length * 3, emoji: "⭐", clr: "#FFD700" },
                  { label: "Планеты", val: completedCount, max: planets.length, emoji: "🪐", clr: "#A78BFA" },
                  { label: "Бейджи", val: badgesEarned, max: badges.length, emoji: "🏅", clr: "#34D399" },
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

              <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-white">Общий прогресс</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{Math.round((completedCount / planets.length) * 100)}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(completedCount / planets.length) * 100}%`, background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)", transition: "width 1s" }} />
                </div>
              </div>

              <h3 className="font-black text-white mb-3">🪐 Планеты</h3>
              <div className="space-y-2 mb-5">
                {planets.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${p.color}25`, border: `2px solid ${p.color}88` }}>
                      {p.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{p.name}</div>
                      <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{p.topic}</div>
                    </div>
                    <StarRating stars={p.stars} />
                  </div>
                ))}
              </div>

              <h3 className="font-black text-white mb-3">🏆 Бейджи и достижения</h3>
              <div className="grid grid-cols-2 gap-3 pb-8">
                {badges.map((badge) => (
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
