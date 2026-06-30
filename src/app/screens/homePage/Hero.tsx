import { useState } from "react";
import { Container } from "@mui/material";

const SEARCH_TABS = ["Pets", "Items", "Helpers"];
const FILTER_CHIPS = ["All Animals", "Age", "Size", "Gender", "Price", "More filters"];

// Korean Smart Search flow (UI-only / local state)
const SMART_STEPS = [
  {
    icon: "🏠",
    label: "Home type",
    question: "어떤 집에 살고 있나요?",
    answers: ["아파트", "단독주택"],
  },
  {
    icon: "⭐",
    label: "Experience",
    question: "반려동물 경험이 있나요?",
    answers: ["처음이에요", "경험 있어요"],
  },
  {
    icon: "⏰",
    label: "Time",
    question: "하루에 돌볼 수 있는 시간은?",
    answers: ["짧아요", "충분해요"],
  },
  {
    icon: "🌿",
    label: "Allergies",
    question: "알레르기가 있나요?",
    answers: ["네", "아니요"],
  },
  {
    icon: "💚",
    label: "Personality",
    question: "어떤 성격의 친구를 원하나요?",
    answers: ["조용한 친구", "활발한 친구"],
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState<string>("Pets");
  const [searchText, setSearchText] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [picked, setPicked] = useState<(string | null)[]>(
    Array(SMART_STEPS.length).fill(null)
  );

  const scrollToSmart = () => {
    document
      .getElementById("smart-search")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const pickAnswer = (answer: string) => {
    const next = [...picked];
    next[step] = answer;
    setPicked(next);
    if (step < SMART_STEPS.length - 1) setStep(step + 1);
  };

  const current = SMART_STEPS[step];

  return (
    <section className="pet-hero">
      <Container className="pet-hero-inner" disableGutters>
        {/* ---- left: copy + search ---- */}
        <div className="hero-main">
          <div className="hero-head">
            <h1 className="hero-title">
              Meet your <span>next tiny family</span>
              <em className="deco">🐾</em>
            </h1>
            <p className="hero-sub">
              Search pets, helpers, and trusted items in one happy place.
            </p>
          </div>

          <div className="hero-visual">
            <div
              className="hero-photo"
              style={{ backgroundImage: "url(/img/home/hero-pets.webp)" }}
            />
            <span className="deco d1" role="img" aria-label="love">
              ❤️
            </span>
            <span className="deco d2" role="img" aria-label="star">
              ⭐
            </span>
            <span className="deco d3" role="img" aria-label="chick">
              🐥
            </span>
            <span className="deco d4" role="img" aria-label="smile">
              😊
            </span>
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

        {/* ---- right: Korean Smart Search card ---- */}
        <aside className="smart-card" id="smart-search">
          <div className="sc-head">
            <div className="sc-spark" role="img" aria-label="sparkle">
              ✨
            </div>
            <h3>Smart Search</h3>
            <p>나에게 맞는 반려동물 찾기</p>
          </div>

          <div className="sc-steps">
            {SMART_STEPS.map((s, i) => (
              <div
                key={s.label}
                className={
                  "sc-step" +
                  (i === step ? " active" : "") +
                  (picked[i] ? " done" : "")
                }
              >
                <div className="sc-ico">{s.icon}</div>
                <div className="sc-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="sc-question">
            <p className="sc-q">{current.question}</p>
            <div className="sc-answers">
              {current.answers.map((a) => (
                <button
                  key={a}
                  className={picked[step] === a ? "picked" : ""}
                  onClick={() => pickAnswer(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button className="sc-start" onClick={() => setStep(0)}>
            스마트 매칭 시작
          </button>
        </aside>
      </Container>
    </section>
  );
}
