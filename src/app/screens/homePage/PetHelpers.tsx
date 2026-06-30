import { useHistory } from "react-router-dom";

/**
 * Pet Helpers — isolated local mock data.
 * Replace this array with a PetHelperService call when the backend is ready;
 * the card layout below does not need to change.
 */
interface Helper {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
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
    message: "Loving daily care for your pup.",
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
    message: "Calm, gentle handling for cats.",
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
    message: "Friendly care for tiny friends.",
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
    message: "Patient care for feathered pets.",
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
          {MOCK_HELPERS.map((helper) => (
            <div key={helper._id} className="helper-card">
              <div className="helper-top">
                <img
                  className="helper-photo"
                  src={helper.image}
                  alt={helper.name}
                />
                {helper.verified ? (
                  <span className="helper-badge" title="Verified helper">
                    ✓
                  </span>
                ) : null}
              </div>
              <div className="helper-name">{helper.name}</div>
              <div className="helper-spec">{helper.specialty}</div>
              <div className="helper-exp">{helper.experience}</div>
              <div className="helper-tags">
                {helper.animals.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </div>
              <div className="helper-rating">
                <span role="img" aria-label="star">⭐</span> {helper.rating.toFixed(1)}{" "}
                <em>({helper.reviews})</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
