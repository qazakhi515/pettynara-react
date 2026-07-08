import React from "react";

export default function Advertisement() {
  return (
    <section className="pet-video">
      <div className="ph-container">
        <div className="ph-section-head">
          <h2>
            Happy Tails at Pettynara{" "}
            <span role="img" aria-label="paw">
              🐾
            </span>
          </h2>
        </div>
      </div>

      {/* Full-bleed video band — spans the whole page width */}
      <div className="pet-video-band">
        <video className="pet-video-media" autoPlay loop muted playsInline>
          <source type="video/mp4" src="/video/dogs.mp4" />
        </video>
      </div>
    </section>
  );
}
