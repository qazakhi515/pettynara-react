import { useParams, useHistory } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { findHelper } from "../../../lib/data/helpers";
import "../../../css/pettynara-helpers.css";

export default function HelperDetail() {
  const { helperId } = useParams<{ helperId: string }>();
  const history = useHistory();
  const helper = findHelper(helperId);

  /** Copy rather than dial. A tel: link hands the number straight to the phone
   *  app on a mis-tap, and these are other people's personal numbers — the
   *  visitor should be the one who decides to place the call. */
  const copyPhone = () => {
    if (!helper) return;
    navigator.clipboard
      ?.writeText(helper.phone)
      .then(() => sweetTopSmallSuccessAlert("Phone number copied!", 1200))
      .catch(() => {});
  };

  if (!helper) {
    return (
      <div className="helper-detail">
        <div className="helpers-wrap">
          <div className="hd-notfound">
            <span>Helper not found.</span>
            <button type="button" onClick={() => history.push("/helpers")}>
              Back to Helpers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="helper-detail">
      <div className="helpers-wrap">
        {/* breadcrumb */}
        <div className="helpers-breadcrumb hd-breadcrumb">
          <span onClick={() => history.push("/")}>Home</span>
          <i>›</i>
          <span onClick={() => history.push("/helpers")}>Helpers</span>
          <i>›</i>
          <b>{helper.name}</b>
        </div>

        <div className="hd-grid">
          {/* LEFT — media + about */}
          <div className="hd-left">
            <div className="hd-media">
              <img src={helper.image} alt={helper.name} />
              {helper.verified ? (
                <span className="hd-badge">✓ Verified helper</span>
              ) : null}
            </div>

            <div className="hd-info-card">
              <div className="hd-name-row">
                <h1 className="hd-name">{helper.name}</h1>
                <div className="hd-rating">
                  <span role="img" aria-label="star">
                    ⭐
                  </span>{" "}
                  {helper.rating.toFixed(1)} <em>({helper.reviews} reviews)</em>
                </div>
              </div>

              <div className="hd-spec">
                <WorkspacePremiumIcon /> {helper.specialty}
              </div>
              <div className="hd-sub">
                {helper.experience} · 📍 {helper.location}
              </div>

              <div className="hd-tags">
                {helper.animals.map((a) => (
                  <span key={a}>{a}</span>
                ))}
              </div>

              <div className="hd-about">
                <h3>About</h3>
                <p>{helper.about}</p>
              </div>
            </div>
          </div>

          {/* RIGHT — contact card */}
          <div className="hd-contact-card">
            <h3>Contact &amp; Booking</h3>

            <button
              type="button"
              className="hd-row hd-row-link"
              onClick={copyPhone}
            >
              <span className="hd-row-ico">
                <PhoneIcon />
              </span>
              <span className="hd-row-text">
                <b>Phone number</b>
                <span>{helper.phone}</span>
              </span>
            </button>

            <div className="hd-row">
              <span className="hd-row-ico">
                <LocationOnIcon />
              </span>
              <span className="hd-row-text">
                <b>Address</b>
                <span>{helper.address}</span>
              </span>
            </div>

            <div className="hd-row">
              <span className="hd-row-ico">
                <AccessTimeIcon />
              </span>
              <span className="hd-row-text">
                <b>Working hours</b>
                <span>Negotiable (by agreement)</span>
              </span>
            </div>

            <div className="hd-row">
              <span className="hd-row-ico">
                <PaymentsOutlinedIcon />
              </span>
              <span className="hd-row-text">
                <b>Price</b>
                <span>Negotiable (by agreement)</span>
              </span>
            </div>

            <button type="button" className="hd-call-btn" onClick={copyPhone}>
              <ContentCopyIcon /> Copy number
            </button>
            <p className="hd-note">
              Working hours and price are arranged directly with the helper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
