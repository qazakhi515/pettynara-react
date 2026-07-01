import { useHistory } from "react-router-dom";
import "../../../css/pettynara-helpers.css";

/**
 * Pet Helpers home section — isolated local mock data.
 * Uses the same modern card as the /helpers page.
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
  {
    _id: "h1",
    name: "Jiyeon Kim",
    specialty: "Dog Care Specialist",
    experience: "3 yrs experience",
    location: "Seoul, Korea",
    message: "Loving daily care and walks for your pup.",
    animals: ["Dogs", "Puppies"],
    rating: 5.0,
    reviews: 128,
    image: "/img/home/ithelper.png",
    verified: true,
  },
  {
    _id: "h2",
    name: "Minho Park",
    specialty: "Cat Care Specialist",
    experience: "4 yrs experience",
    location: "Seoul, Korea",
    message: "Calm, gentle handling for shy cats.",
    animals: ["Cats", "Kittens"],
    rating: 5.0,
    reviews: 98,
    image: "/img/home/catHelper.jpg",
    verified: true,
  },
  {
    _id: "h3",
    name: "Soojin Lee",
    specialty: "Small Animals Helper",
    experience: "2 yrs experience",
    location: "Incheon, Korea",
    message: "Friendly care for rabbits and tiny friends.",
    animals: ["Rabbits", "Guinea Pigs"],
    rating: 4.9,
    reviews: 76,
    image: "/img/home/rabbithelper.jpg",
    verified: true,
  },
  {
    _id: "h4",
    name: "Hyunwoo Choi",
    specialty: "Bird Care Helper",
    experience: "3 yrs experience",
    location: "Busan, Korea",
    message: "Patient care for parrots and songbirds.",
    animals: ["Birds", "Parrots"],
    rating: 4.9,
    reviews: 76,
    image: "/img/home/muhelper.png",
    verified: true,
  },
];

export default function PetHelpers() {
  const history = useHistory();

  return (
    <section className="pet-helpers">
      <div className="ph-container">
        <div className="ph-section-head">
          <h2>
            Pet Helpers <span role="img" aria-label="paw">🐾</span>
          </h2>
          <span className="ph-viewall" onClick={() => history.push("/helpers")}>
            View all
          </span>
        </div>

        <div className="helper-row">
          {MOCK_HELPERS.map((h) => (
            <div key={h._id} className="helper-page-card">
              <div className="hpc-top">
                <img className="hpc-photo" src={h.image} alt={h.name} />
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
                  <button
                    className="hpc-contact"
                    onClick={() => history.push("/helpers")}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
