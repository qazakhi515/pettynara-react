import React from "react";
import { Link } from "react-router-dom";

const TRUST = [
  { icon: "🛡️", title: "Safe Adoption", desc: "Verified listings & careful screening." },
  { icon: "✅", title: "Verified Helpers", desc: "Background checked & rated." },
  { icon: "⭐", title: "Review System", desc: "Real reviews from real users." },
  { icon: "💚", title: "Smart Matching", desc: "The best fit, every time." },
];

export default function Footer() {
  return (
    <footer className="pettynara-footer">
      {/* trust strip — short text/badges only, not a route */}
      <div className="ph-container">
        <div className="foot-trust">
          {TRUST.map((t) => (
            <div key={t.title} className="trust-item">
              <span className="trust-ico" role="img" aria-label={t.title}>
                {t.icon}
              </span>
              <div>
                <div className="trust-title">{t.title}</div>
                <div className="trust-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="foot-main">
          <div className="foot-brand">
            <div className="foot-logo">
              <span className="brand-mark" role="img" aria-label="Pettynara">
                🐶
              </span>
              <span className="brand-name">Pettynara</span>
            </div>
            <p className="foot-desc">
              A Korean-friendly pet marketplace. Meet your next tiny family —
              pets, helpers, and trusted items in one happy place.
            </p>
          </div>

          <div className="foot-col">
            <div className="foot-col-title">Explore</div>
            <Link to="/">Home</Link>
            <Link to="/products?collection=DOG">Dogs</Link>
            <Link to="/products?collection=CAT">Cats</Link>
            <Link to="/helpers">Helpers</Link>
          </div>

          <div className="foot-col">
            <div className="foot-col-title">Find us</div>
            <div className="foot-find">
              <span>L.</span> Gangnam-gu, Seoul, Korea
            </div>
            <div className="foot-find">
              <span>P.</span> +82 2 1234 5678
            </div>
            <div className="foot-find">
              <span>E.</span> support@pettynara.com
            </div>
            <div className="foot-find">
              <span>H.</span> Support 09:00 – 21:00 KST
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          © {new Date().getFullYear()} Pettynara. Adoption, not shopping — give
          love, save a life.
        </div>
      </div>
    </footer>
  );
}
