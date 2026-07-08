import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory } from "react-router-dom";
import { retrieveNewDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

const accessoriesRetriever = createSelector(
  retrieveNewDishes,
  (newDishes) => ({ newDishes })
);

interface ItemCard {
  _id: string;
  name: string;
  price: number;
  image: string;
  productId?: string;
}

/** Local fallback shown until the backend serves ACCESSORY products. */
const MOCK_ITEMS: ItemCard[] = [
  { _id: "i1", name: "Premium Dog Food", price: 24.9, image: "/img/home/item1.jpg" },
  { _id: "i2", name: "Cat Tree Tower", price: 59.9, image: "/img/home/item2.jpg" },
  { _id: "i3", name: "Pet Carrier Bag", price: 39.9, image: "/img/home/item3.jpg" },
  { _id: "i4", name: "Interactive Toy", price: 12.9, image: "/img/home/item4.jpg" },
  { _id: "i5", name: "Aquarium Set", price: 89.9, image: "/img/home/item5.jpg" },
  { _id: "i6", name: "Rabbit Cage", price: 69.9, image: "/img/home/item6.jpg" },
  { _id: "i7", name: "Grooming Brush", price: 14.9, image: "/img/home/item7.jpg" },
  { _id: "i8", name: "Pet Bed (Cozy)", price: 34.9, image: "/img/home/item8.jpg" },
];

export default function Accessories() {
  const { newDishes } = useSelector(accessoriesRetriever);
  const history = useHistory();

  // Prefer real backend data; fall back to local cards when empty.
  // Cap at 5 cards on the home page regardless of the source.
  const items: ItemCard[] = (
    newDishes.length !== 0
      ? newDishes.map((item: Product) => ({
          _id: item._id,
          productId: item._id,
          name: item.productName,
          price: item.productPrice,
          image: item.productImages?.[0]
            ? `${serverApi}/${item.productImages[0]}`
            : "/img/home/item1.webp",
        }))
      : MOCK_ITEMS
  ).slice(0, 5);

  const onCardClick = (item: ItemCard) => {
    if (item.productId) history.push(`/products/${item.productId}`);
  };

  return (
    <section className="pet-accessories">
      <div className="ph-container">
        <div className="ph-section-head">
          <h2>
            Pet Items <span role="img" aria-label="bag">🛍️</span>
          </h2>
          <span
            className="ph-viewall"
            onClick={() => history.push("/products?collection=ACCESSORY")}
          >
            View all
          </span>
        </div>

        <div className="item-row">
          {items.map((item) => (
            <div
              key={item._id}
              className="item-card"
              onClick={() => onCardClick(item)}
            >
              <div
                className="item-photo"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="item-body">
                <div className="item-name">{item.name}</div>
                <div className="item-price">₩{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
