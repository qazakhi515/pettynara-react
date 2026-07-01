import { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../../css/pettynara-helpers.css";

/**
 * Pet Helpers page — isolated local mock data.
 * Swap MOCK_HELPERS for a PetHelperService call when the backend is ready;
 * the layout below does not need to change.
 */
interface Helper {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  message: string;
  animals: string[];
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
}

const MOCK_HELPERS: Helper[] = [
  { _id: "h1", name: "Jiyeon Kim", specialty: "Dog Care Specialist", experience: "3 yrs experience", location: "Seoul, Korea", message: "Loving daily care and walks for your pup.", animals: ["Dogs", "Puppies"], rating: 5.0, reviews: 128, image: "/img/home/ithelper.png", verified: true },
  { _id: "h2", name: "Minho Park", specialty: "Cat Care Specialist", experience: "4 yrs experience", location: "Seoul, Korea", message: "Calm, gentle handling for shy cats.", animals: ["Cats", "Kittens"], rating: 5.0, reviews: 98, image: "/img/home/catHelper.jpg", verified: true },
  { _id: "h3", name: "Soojin Lee", specialty: "Small Animals Helper", experience: "2 yrs experience", location: "Incheon, Korea", message: "Friendly care for rabbits and tiny friends.", animals: ["Rabbits", "Guinea Pigs"], rating: 4.9, reviews: 76, image: "/img/home/rabbithelper.jpg", verified: true },
  { _id: "h4", name: "Hyunwoo Choi", specialty: "Bird Care Helper", experience: "3 yrs experience", location: "Busan, Korea", message: "Patient care for parrots and songbirds.", animals: ["Birds", "Parrots"], rating: 4.9, reviews: 76, image: "/img/home/muhelper.png", verified: true },
  { _id: "h5", name: "Eunji Han", specialty: "Dog Walker", experience: "2 yrs experience", location: "Seoul, Korea", message: "Energetic daily walks, rain or shine.", animals: ["Dogs"], rating: 4.8, reviews: 54, image: "/img/home/doghelper.jpg", verified: true },
  { _id: "h6", name: "Jisoo Kang", specialty: "Puppy Trainer", experience: "5 yrs experience", location: "Daejeon, Korea", message: "Positive-reinforcement puppy training.", animals: ["Dogs", "Puppies"], rating: 5.0, reviews: 112, image: "/img/home/dogHel.jpg", verified: true },
  { _id: "h7", name: "Daniel Cho", specialty: "Cat Sitter", experience: "3 yrs experience", location: "Gwangju, Korea", message: "In-home sitting so your cat stays comfy.", animals: ["Cats"], rating: 4.7, reviews: 41, image: "/img/justin.webp", verified: false },
  { _id: "h8", name: "Seoyeon Yoon", specialty: "Multi-pet Helper", experience: "4 yrs experience", location: "Ulsan, Korea", message: "Comfortable with dogs, cats and more.", animals: ["Dogs", "Cats"], rating: 4.9, reviews: 88, image: "/img/martin.webp", verified: true },
];

const TRUST = [
  { icon: "✅", title: "Verified Helpers", desc: "Background checked" },
  { icon: "⭐", title: "Real Reviews", desc: "From real owners" },
  { icon: "🛡️", title: "Safe & Trusted", desc: "Every booking" },
  { icon: "🎧", title: "24/7 Support", desc: "We're here to help" },
];

const FILTERS = ["All", "Dogs", "Cats", "Birds", "Rabbits"];

export default function HelpersPage() {
  const history = useHistory();
  const [filter, setFilter] = useState<string>("All");

  const helpers =
    filter === "All"
      ? MOCK_HELPERS
      : MOCK_HELPERS.filter((h) => h.animals.includes(filter));

  return (
    <div className="helpers-page">
      {/* ===== Header ===== */}
      <div className="helpers-header">
        <div className="helpers-wrap">
          <div className="helpers-breadcrumb">
            <span onClick={() => history.push("/")}>Home</span>
            <i>›</i>
            <b>Helpers</b>
          </div>
          <h1 className="helpers-title">
            Pet Helpers <span role="img" aria-label="paw">🐾</span>
          </h1>
          <p className="helpers-subtitle">
            Trusted, verified helpers to care for your pets — walking, sitting,
            training and more.
          </p>

          <div className="helpers-trust">
            {TRUST.map((t) => (
              <div key={t.title} className="helpers-trust-item">
                <span className="ht-ico" role="img" aria-label={t.title}>
                  {t.icon}
                </span>
                <div>
                  <div className="ht-title">{t.title}</div>
                  <div className="ht-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="helpers-wrap helpers-body">
        <div className="helpers-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={"hf-chip" + (filter === f ? " active" : "")}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="helpers-count">{helpers.length} helpers available</div>

        <div className="helpers-grid">
          {helpers.map((h) => (
            <div key={h._id} className="helper-page-card">
              <div className="hpc-top">
                <img
                  className="hpc-photo"
                  src={h.image}
                  alt={h.name}
                />
                {h.verified ? (
                  <span className="hpc-badge" title="Verified helper">
                    ✓ Verified
                  </span>
                ) : null}
              </div>

              <div className="hpc-body">
                <div className="hpc-name">{h.name}</div>
                <div className="hpc-spec">{h.specialty}</div>
                <div className="hpc-sub">
                  {h.experience} · 📍 {h.location}
                </div>

                <p className="hpc-message">“{h.message}”</p>

                <div className="hpc-tags">
                  {h.animals.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>

                <div className="hpc-foot">
                  <div className="hpc-rating">
                    <span role="img" aria-label="star">⭐</span>{" "}
                    {h.rating.toFixed(1)} <em>({h.reviews})</em>
                  </div>
                  <button className="hpc-contact">Contact</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
