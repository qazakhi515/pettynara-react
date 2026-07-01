import { useState } from "react";
import {
  Answers,
  computeMatches,
  MatchResult,
} from "./smartMatch";

const SEARCH_TABS = ["Pets", "Items", "Helpers"];
const FILTER_CHIPS = [
  "All Animals",
  "Age",
  "Size",
  "Gender",
  "Price",
  "More filters",
];

type StepKey = keyof Answers;
interface Step {
  key: StepKey;
  icon: string;
  label: string;
  question: string;
  options: { v: string; t: string }[];
}

const STEPS: Step[] = [
  {
    key: "home",
    icon: "🏠",
    label: "Home",
    question: "어떤 집에 살고 있나요?",
    options: [
      { v: "apartment", t: "아파트" },
      { v: "house", t: "단독주택" },
    ],
  },
  {
    key: "exp",
    icon: "⭐",
    label: "Experience",
    question: "반려동물 경험이 있나요?",
    options: [
      { v: "first", t: "처음이에요" },
      { v: "experienced", t: "경험 있어요" },
    ],
  },
  {
    key: "time",
    icon: "⏰",
    label: "Time",
    question: "하루에 돌볼 수 있는 시간은?",
    options: [
      { v: "low", t: "짧아요" },
      { v: "enough", t: "충분해요" },
    ],
  },
  {
    key: "allergy",
    icon: "🌿",
    label: "Allergy",
    question: "알레르기가 있나요?",
    options: [
      { v: "yes", t: "있어요" },
      { v: "no", t: "없어요" },
    ],
  },
  {
    key: "energy",
    icon: "💚",
    label: "Personality",
    question: "어떤 성격을 원하나요?",
    options: [
      { v: "calm", t: "조용한 친구" },
      { v: "active", t: "활발한 친구" },
    ],
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState<string>("Pets");
  const [searchText, setSearchText] = useState<string>("");

  // Smart Match state
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const scrollToSmart = () => {
    document
      .getElementById("smart-search")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const allAnswered = STEPS.every((s) => answers[s.key]);
  const current = STEPS[step];

  const pick = (key: StepKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const startMatching = () => setResults(computeMatches(answers));
  const reset = () => {
    setAnswers({});
    setStep(0);
    setResults(null);
  };

  return (
    <section className="pet-hero">
      <div className="pet-hero-head">
        <h1 className="hero-title">
          Meet your <span>next tiny family</span>
          <em className="deco">🐾</em>
        </h1>
        <p className="hero-sub">
          Search pets, helpers, and trusted items in one happy place.
        </p>
      </div>
      <div className="pet-hero-inner">
        {/* ---- left: photo + search ---- */}
        <div className="hero-main">
          <div className="hero-visual">
            <div
              className="hero-photo"
              style={{ backgroundImage: "url(/img/heroPage.png)" }}
            />
          </div>

          <div className="hero-search">
            <div className="hs-tabs">
              {SEARCH_TABS.map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="hs-row">
              <button className="hs-loc">📍 Seoul</button>
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="hs-smart" onClick={scrollToSmart}>
                ✨ Smart Match
              </button>
            </div>

            <div className="hs-chips">
              {FILTER_CHIPS.map((chip, i) => (
                <span key={chip} className={i === 0 ? "lead" : ""}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---- right: Smart Match ---- */}
        <aside className="smart-card" id="smart-search">
          <div className="sc-head">
            <h3>
              <span className="sc-spark" role="img" aria-label="sparkle">
                ✨
              </span>{" "}
              Smart Match
            </h3>
            <p>나에게 맞는 반려동물 찾기</p>
          </div>

          {/* progress icons */}
          <div className="sc-steps">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                className={
                  "sc-step" +
                  (i === step && !results ? " active" : "") +
                  (answers[s.key] ? " done" : "")
                }
                onClick={() => !results && setStep(i)}
                title={s.label}
              >
                <span className="sc-ico">{s.icon}</span>
              </button>
            ))}
          </div>

          {!results ? (
            <>
              {/* one question per screen */}
              <div className="sc-question">
                <div className="sc-qtop">
                  <span className="sc-qcount">
                    {step + 1} / {STEPS.length}
                  </span>
                  {step > 0 ? (
                    <button
                      className="sc-back"
                      onClick={() => setStep(step - 1)}
                    >
                      ‹ Back
                    </button>
                  ) : null}
                </div>
                <p className="sc-q">{current.question}</p>
                <div className="sc-answers">
                  {current.options.map((o) => (
                    <button
                      key={o.v}
                      className={
                        answers[current.key] === o.v ? "picked" : ""
                      }
                      onClick={() => pick(current.key, o.v)}
                    >
                      {o.t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="sc-start"
                disabled={!allAnswered}
                onClick={startMatching}
              >
                스마트 매칭 시작
              </button>
            </>
          ) : (
            /* results */
            <div className="sc-results">
              {results.length === 0 ? (
                <div className="sc-noresult">
                  No perfect match found — try adjusting your answers.
                </div>
              ) : (
                results.map((m, i) => (
                  <div key={m.name} className="sc-match">
                    <div
                      className="sc-match-photo"
                      style={{ backgroundImage: `url(${m.image})` }}
                    >
                      <span className="sc-rank">#{i + 1}</span>
                    </div>
                    <div className="sc-match-body">
                      <div className="sc-match-top">
                        <span className="sc-match-name">{m.name}</span>
                        <span className="sc-score">{m.score}</span>
                      </div>
                      <span className="sc-match-label">{m.label}</span>
                      <div className="sc-reasons">
                        {m.reasons.map((r) => (
                          <span key={r} className="sc-reason">
                            ✓ {r}
                          </span>
                        ))}
                        {m.cautions.map((c) => (
                          <span key={c} className="sc-caution">
                            ! {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button className="sc-start ghost" onClick={reset}>
                다시 하기
              </button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
