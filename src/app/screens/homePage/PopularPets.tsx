import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory } from "react-router-dom";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { getImageUrl } from "../../../lib/config";
import FavoriteButton from "../../components/favorite/FavoriteButton";

const popularRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes })
);

interface PetCard {
  _id: string;
  name: string;
  meta: string;
  location: string;
  views: number;
  image: string;
  flag: string;
  productId?: string;
}

// Friendly species label; unknown/legacy values (OTHER, DESSERT...) -> "Pet"
const SPECIES_LABEL: Record<string, string> = {
  DOG: "Dog",
  CAT: "Cat",
  BIRD: "Bird",
  FISH: "Fish",
  RABBIT: "Rabbit",
  ACCESSORY: "Accessory",
};
const speciesLabel = (c: string): string => SPECIES_LABEL[c] ?? "Pet";

/** Local fallback shown until the backend serves DOG/CAT/... products. */
const MOCK_PETS: PetCard[] = [
  { _id: "p1", name: "Golden Retriever", meta: "Male • 2 months", location: "Seoul, Korea", views: 1200, image: "/img/home/pet1.webp", flag: "Free" },
  { _id: "p2", name: "Munchkin Cat", meta: "Female • 3 months", location: "Seoul, Korea", views: 982, image: "/img/home/pet2.webp", flag: "Verified" },
  { _id: "p3", name: "Pomeranian", meta: "Male • 4 months", location: "Gyeonggi, Korea", views: 1600, image: "/img/home/pet3.webp", flag: "Free" },
  { _id: "p4", name: "Holland Lop", meta: "Female • 5 months", location: "Seoul, Korea", views: 755, image: "/img/home/pet4.webp", flag: "Verified" },
  { _id: "p5", name: "Cockatiel", meta: "Male • 6 months", location: "Incheon, Korea", views: 642, image: "/img/home/pet5.webp", flag: "Free" },
];

export default function PopularPets() {
  const { popularDishes } = useSelector(popularRetriever);
  const history = useHistory();

  // Prefer real backend data; fall back to local cards when empty.
  const cards: PetCard[] =
    popularDishes.length !== 0
      ? popularDishes.map((pet: Product) => ({
          _id: pet._id,
          productId: pet._id,
          name: pet.productName,
          meta: speciesLabel(pet.productCollection),
          location: "Korea",
          views: pet.productViews,
          image: pet.productImages?.[0]
            ? getImageUrl(pet.productImages[0])
            : "/img/home/pet1.webp",
          flag: "Verified",
        }))
      : MOCK_PETS;

  const onCardClick = (card: PetCard) => {
    if (card.productId) history.push(`/products/${card.productId}`);
  };

  return (
    <section className="popular-pets">
      <div className="ph-container">
        <div className="ph-section-head">
          <h2>
            Popular Pets <span role="img" aria-label="paw">🐾</span>
          </h2>
          <span className="ph-viewall" onClick={() => history.push("/products")}>
            View all
          </span>
        </div>

        <div className="pet-row">
          {cards.map((pet) => {
            return (
              <div
                key={pet._id}
                className="pet-card"
                onClick={() => onCardClick(pet)}
              >
                <div
                  className="pet-photo"
                  style={{ backgroundImage: `url(${pet.image})` }}
                >
                  <span className="pet-flag">{pet.flag}</span>
                  <FavoriteButton id={pet._id} className="pet-fav" />
                </div>
                <div className="pet-body">
                  <div className="pet-name">{pet.name}</div>
                  <div className="pet-meta">{pet.meta}</div>
                  <div className="pet-meta">📍 {pet.location}</div>
                  <div className="pet-stats">
                    <span role="img" aria-label="views">👁️</span> {pet.views}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
