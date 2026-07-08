import { useHistory } from "react-router-dom";
import { HELPERS } from "../../../lib/data/helpers";
import "../../../css/pettynara-helpers.css";

/**
 * Pet Helpers home section — shows the first few helpers from the shared list.
 * Uses the same modern card as the /helpers page.
 */
const HOME_HELPERS = HELPERS.slice(0, 5);

export default function PetHelpers() {
  const history = useHistory();

  return (
    <section className="pet-helpers">
      <div className="ph-container">
        <div className="ph-section-head">
          <h2>
            Pet Helpers{" "}
            <span role="img" aria-label="paw">
              🐾
            </span>
          </h2>
          <span className="ph-viewall" onClick={() => history.push("/helpers")}>
            View all
          </span>
        </div>

        <div className="helper-row">
          {HOME_HELPERS.map((h) => (
            <div
              key={h._id}
              className="helper-page-card"
              onClick={() => history.push(`/helpers/${h._id}`)}
            >
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

                <div className="hpc-tags">
                  {h.animals.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>

                <div className="hpc-foot">
                  <div className="hpc-rating">
                    <span role="img" aria-label="star">
                      ⭐
                    </span>{" "}
                    {h.rating.toFixed(1)} <em>({h.reviews})</em>
                  </div>
                  <button
                    type="button"
                    className="hpc-contact"
                    onClick={(e) => {
                      e.stopPropagation();
                      history.push(`/helpers/${h._id}`);
                    }}
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
