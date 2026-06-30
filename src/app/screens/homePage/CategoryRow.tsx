import { useHistory } from "react-router-dom";
import { ProductCollection } from "../../../lib/enums/product.enum";

interface Category {
  key: string;
  name: string;
  collection: ProductCollection;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    key: "dog",
    name: "Dogs",
    collection: ProductCollection.DOG,
    image: "/img/home/dogs.webp",
  },
  {
    key: "cat",
    name: "Cats",
    collection: ProductCollection.CAT,
    image: "/img/home/cats.webp",
  },
  {
    key: "bird",
    name: "Birds",
    collection: ProductCollection.BIRD,
    image: "/img/home/birds.webp",
  },
  {
    key: "fish",
    name: "Fish",
    collection: ProductCollection.FISH,
    image: "/img/home/fish.webp",
  },
  {
    key: "rabbit",
    name: "Rabbits",
    collection: ProductCollection.RABBIT,
    image: "/img/home/rabbits.webp",
  },
  {
    key: "accessory",
    name: "Accessories",
    collection: ProductCollection.ACCESSORY,
    image: "/img/home/accessories.webp",
  },
];

export default function CategoryRow() {
  const history = useHistory();

  const goToCollection = (collection: ProductCollection) => {
    history.push(`/products?collection=${collection}`);
  };

  return (
    <section className="pet-category">
      <div className="ph-container">
        <div className="cat-row">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className={`cat-card c-${cat.key}`}
              onClick={() => goToCollection(cat.collection)}
            >
              <div
                className="cat-thumb"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
