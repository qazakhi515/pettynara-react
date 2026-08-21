import { useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { setChosenProduct, setRestaurant } from "./slice";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/memberService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import FavoriteButton from "../../components/favorite/FavoriteButton";
import "../../../css/pettynara-detail.css";

const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});
const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);
const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant })
);

const SPECIES_LABEL: Record<string, string> = {
  DOG: "Dog",
  CAT: "Cat",
  BIRD: "Bird",
  FISH: "Fish",
  RABBIT: "Rabbit",
  ACCESSORY: "Accessory",
};
const speciesLabel = (c: string): string => SPECIES_LABEL[c] ?? "Pet";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "health", label: "Health" },
  { key: "parents", label: "Parents" },
  { key: "reviews", label: "Reviews" },
];

const RECENT_KEY = "pettynara_recent";

interface RecentItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const history = useHistory();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);

  const [imgIndex, setImgIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [tab, setTab] = useState("overview");
  const [related, setRelated] = useState<Product[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);

  // fetch product + seller
  useEffect(() => {
    setImgIndex(0);
    setTab("overview");
    window.scrollTo({ top: 0 });
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // related pets + recently viewed (depends on the loaded product)
  useEffect(() => {
    if (!chosenProduct) return;
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "productViews",
        productCollection: chosenProduct.productCollection as ProductCollection,
      })
      .then((data) =>
        setRelated(data.filter((p) => p._id !== chosenProduct._id).slice(0, 4))
      )
      .catch((err) => console.log(err));

    // recently viewed (localStorage)
    try {
      const prev: RecentItem[] = JSON.parse(
        localStorage.getItem(RECENT_KEY) || "[]"
      );
      setRecent(prev.filter((p) => p._id !== chosenProduct._id).slice(0, 6));
      const entry: RecentItem = {
        _id: chosenProduct._id,
        name: chosenProduct.productName,
        price: chosenProduct.productPrice,
        image: chosenProduct.productImages?.[0] ?? "",
      };
      const next = [
        entry,
        ...prev.filter((p) => p._id !== chosenProduct._id),
      ].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch (e) {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenProduct?._id]);

  const images = useMemo(() => {
    if (chosenProduct?.productImages?.length)
      return chosenProduct.productImages.map((i) => `${serverApi}/${i}`);
    return ["/img/home/pet1.webp"];
  }, [chosenProduct]);

  // lightbox keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight")
        setImgIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setImgIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  // ===== Skeleton while loading =====
  if (!chosenProduct) {
    return (
      <div className="pet-detail">
        <div className="pd-wrap pd-layout">
          <div className="pd-content">
            <div className="pd-skel pd-skel-hero" />
            <div className="pd-skel pd-skel-line" />
            <div className="pd-skel pd-skel-line short" />
          </div>
          <aside className="pd-sidebar">
            <div className="pd-skel pd-skel-box" />
          </aside>
        </div>
      </div>
    );
  }

  const isNew =
    Date.now() - new Date(chosenProduct.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 14;
  const isPopular = chosenProduct.productViews > 0;
  const regId = chosenProduct._id.slice(-8).toUpperCase();
  const location = restaurant?.memberAddress || "Seoul, Korea";

  const handleAdd = () => {
    onAdd({
      _id: chosenProduct._id,
      quantity: 1,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      image: chosenProduct.productImages?.[0] ?? "",
      productCollection: chosenProduct.productCollection,
    });
    sweetTopSmallSuccessAlert("Added to your basket!", 1200);
  };

  const share = () => {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => sweetTopSmallSuccessAlert("Link copied to clipboard!", 1000))
      .catch(() => {});
  };

  const contactSeller = () => {
    sweetTopSmallSuccessAlert(
      `Seller: ${restaurant?.memberNick ?? "Pettynara"} · ${
        restaurant?.memberPhone ?? "—"
      }`,
      1800
    );
  };

  const specs = [
    { label: "Species", value: speciesLabel(chosenProduct.productCollection) },
    { label: "Size", value: chosenProduct.productSize },
    { label: "Health", value: "Healthy" },
    { label: "Vaccination", value: "Up to date" },
    { label: "Location", value: location },
    { label: "Registration ID", value: regId },
    {
      label: "Listed",
      value: new Date(chosenProduct.createdAt).toLocaleDateString(),
    },
    { label: "Views", value: String(chosenProduct.productViews) },
  ];

  return (
    <div className="pet-detail">
      {/* breadcrumb */}
      <div className="pd-wrap pd-breadcrumb">
        <span onClick={() => history.push("/")}>Home</span>
        <i>›</i>
        <span
          onClick={() =>
            history.push(
              `/products?collection=${chosenProduct.productCollection}`
            )
          }
        >
          {speciesLabel(chosenProduct.productCollection)}s
        </span>
        <i>›</i>
        <b>{chosenProduct.productName}</b>
      </div>

      <div className="pd-wrap pd-layout">
        {/* ===== Content (70%) ===== */}
        <div className="pd-content">
          {/* Gallery */}
          <div className="pd-gallery pd-fade">
            <div
              className="pd-hero"
              onClick={() => setLightbox(true)}
              style={{ backgroundImage: `url(${images[imgIndex]})` }}
            >
              <div className="pd-badges">
                <span className="pd-badge verified">✓ Verified</span>
                <span className="pd-badge healthy">Healthy</span>
                {isPopular ? (
                  <span className="pd-badge popular">Popular</span>
                ) : isNew ? (
                  <span className="pd-badge new">New</span>
                ) : null}
              </div>
              <button className="pd-zoom" aria-label="zoom">
                ⤢
              </button>
            </div>
            {images.length > 1 ? (
              <div className="pd-thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={"pd-thumb" + (i === imgIndex ? " active" : "")}
                    onClick={() => setImgIndex(i)}
                    style={{ backgroundImage: `url(${src})` }}
                    aria-label={`image ${i + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* Headline */}
          <div className="pd-headline pd-fade">
            <h1 className="pd-name">{chosenProduct.productName}</h1>
            <div className="pd-sub">
              <span>{speciesLabel(chosenProduct.productCollection)}</span>
              <i>·</i>
              <span>📍 {location}</span>
              <i>·</i>
              <span>👁️ {chosenProduct.productViews} views</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs pd-fade">
            <div className="pd-tabbar">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={"pd-tab" + (tab === t.key ? " active" : "")}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pd-tabpane" key={tab}>
              {tab === "overview" && (
                <div className="pd-overview">
                  <div className="pd-specs">
                    {specs.map((s) => (
                      <div key={s.label} className="pd-spec">
                        <span className="pd-spec-label">{s.label}</span>
                        <span className="pd-spec-value">{s.value}</span>
                      </div>
                    ))}
                  </div>
                  <h3 className="pd-h3">Description</h3>
                  <p className="pd-desc">
                    {chosenProduct.productDesc ||
                      "This adorable friend is looking for a loving home. Healthy, well cared for, and ready to meet your family."}
                  </p>
                </div>
              )}

              {tab === "health" && (
                <div className="pd-info-list">
                  <div className="pd-info-row">
                    <span>Health status</span>
                    <b>Healthy · Vet checked</b>
                  </div>
                  <div className="pd-info-row">
                    <span>Vaccination</span>
                    <b>Up to date</b>
                  </div>
                  <div className="pd-info-row">
                    <span>Microchip</span>
                    <b>Registered ({regId})</b>
                  </div>
                  <div className="pd-info-row">
                    <span>Health guarantee</span>
                    <b>Included</b>
                  </div>
                </div>
              )}

              {tab === "parents" && (
                <div className="pd-empty-tab">
                  <span role="img" aria-label="paw">
                    🐾
                  </span>
                  <p>Parent information is not provided for this listing.</p>
                </div>
              )}

              {tab === "reviews" && (
                <div className="pd-empty-tab">
                  <span role="img" aria-label="star">
                    ⭐
                  </span>
                  <p>No reviews yet — be the first to share your experience.</p>
                </div>
              )}
            </div>
          </div>

          {/* Related pets */}
          {related.length > 0 && (
            <div className="pd-related pd-fade">
              <h3 className="pd-h3">Related Pets</h3>
              <div className="pd-mini-row">
                {related.map((p) => (
                  <div
                    key={p._id}
                    className="pd-mini"
                    onClick={() => history.push(`/products/${p._id}`)}
                  >
                    <div
                      className="pd-mini-photo"
                      style={{
                        backgroundImage: `url(${
                          p.productImages?.[0]
                            ? `${serverApi}/${p.productImages[0]}`
                            : "/img/home/pet1.webp"
                        })`,
                      }}
                    />
                    <div className="pd-mini-name">{p.productName}</div>
                    <div className="pd-mini-price">₩{p.productPrice}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently viewed */}
          {recent.length > 0 && (
            <div className="pd-related pd-fade">
              <h3 className="pd-h3">Recently Viewed</h3>
              <div className="pd-mini-row">
                {recent.map((p) => (
                  <div
                    key={p._id}
                    className="pd-mini"
                    onClick={() => history.push(`/products/${p._id}`)}
                  >
                    <div
                      className="pd-mini-photo"
                      style={{
                        backgroundImage: `url(${
                          p.image
                            ? `${serverApi}/${p.image}`
                            : "/img/home/pet1.webp"
                        })`,
                      }}
                    />
                    <div className="pd-mini-name">{p.name}</div>
                    <div className="pd-mini-price">₩{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== Sidebar (30%, sticky) ===== */}
        <aside className="pd-sidebar">
          <div className="pd-buy pd-fade">
            <div className="pd-price-row">
              <div>
                <div className="pd-price-label">Price</div>
                <div className="pd-price">₩{chosenProduct.productPrice}</div>
              </div>
              <div className="pd-icon-actions">
                <FavoriteButton id={chosenProduct._id} className="pd-icon-btn" />
                <button
                  className="pd-icon-btn"
                  onClick={share}
                  aria-label="share"
                >
                  🔗
                </button>
              </div>
            </div>

            <button className="pd-cta primary" onClick={contactSeller}>
              Contact Seller
            </button>
            <button className="pd-cta ghost" onClick={handleAdd}>
              Add to Basket
            </button>

            <div className="pd-delivery">
              <span role="img" aria-label="truck">
                🚚
              </span>
              Safe delivery available across Korea
            </div>
            <div className="pd-interested">
              <span role="img" aria-label="eye">
                👀
              </span>
              {Math.max(chosenProduct.productViews, 3)} people interested
            </div>
          </div>

          {/* Seller card */}
          <div className="pd-seller pd-fade">
            <div className="pd-seller-head">
              <img
                className="pd-seller-avatar"
                src={
                  restaurant?.memberImage
                    ? `${serverApi}/${restaurant.memberImage}`
                    : "/icons/default-user.svg"
                }
                alt="seller"
              />
              <div>
                <div className="pd-seller-name">
                  {restaurant?.memberNick ?? "Pettynara Seller"}
                  <span className="pd-seller-verified" title="Verified">
                    ✓
                  </span>
                </div>
                <div className="pd-seller-meta">
                  ⭐ 4.9 · 128 reviews
                </div>
              </div>
            </div>
            <div className="pd-seller-rows">
              <div>
                <span>Location</span>
                <b>{location}</b>
              </div>
              <div>
                <span>Response</span>
                <b>Within 1 hour</b>
              </div>
              <div>
                <span>Phone</span>
                <b>{restaurant?.memberPhone ?? "—"}</b>
              </div>
            </div>
            <button className="pd-cta ghost small" onClick={contactSeller}>
              View Profile
            </button>
          </div>
        </aside>
      </div>

      {/* Mascot (desktop only) */}
      <div className="pd-mascot" aria-hidden="true">
        <div className="pd-mascot-bubble">A loving friend is waiting! 🐾</div>
        <img src="/img/itButton.png" alt="" />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="pd-lightbox" onClick={() => setLightbox(false)}>
          <button
            className="pd-lb-close"
            onClick={() => setLightbox(false)}
            aria-label="close"
          >
            ✕
          </button>
          <button
            className="pd-lb-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setImgIndex((i) => (i - 1 + images.length) % images.length);
            }}
            aria-label="previous"
          >
            ‹
          </button>
          <img
            className="pd-lb-img"
            src={images[imgIndex]}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="pd-lb-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setImgIndex((i) => (i + 1) % images.length);
            }}
            aria-label="next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
