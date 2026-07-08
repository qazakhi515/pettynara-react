import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";
import { HELPERS } from "../../../lib/data/helpers";
import "../../../css/pettynara-helpers.css";

const LIMIT = 8; // 4 cards × 2 rows per page

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
  const [page, setPage] = useState<number>(1);

  const helpers =
    filter === "All"
      ? HELPERS
      : HELPERS.filter((h) => h.animals.includes(filter));

  const totalPages = Math.ceil(helpers.length / LIMIT);
  const pagedHelpers = helpers.slice((page - 1) * LIMIT, page * LIMIT);

  const handleFilter = (f: string) => {
    setFilter(f);
    setPage(1); // reset to first page when the filter changes
  };

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            Pet Helpers{" "}
            <span role="img" aria-label="paw">
              🐾
            </span>
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
              onClick={() => handleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="helpers-count">{helpers.length} helpers available</div>

        <div className="helpers-grid">
          {pagedHelpers.map((h) => (
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

                <p className="hpc-message">“{h.message}”</p>

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

        {totalPages > 1 && (
          <Stack className="helpers-pagination" alignItems="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
      </div>
    </div>
  );
}
