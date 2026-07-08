import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { retrieveProducts } from "./selector";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import FavoriteButton from "../../components/favorite/FavoriteButton";
import "../../../css/pettynara-products.css";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface CollectionMeta {
  key: ProductCollection;
  label: string;
  icon: string;
  subtitle: string;
  leftImg: string; // real photo (left)
  rightImg: string; // cartoon (right)
}

const COLLECTIONS: CollectionMeta[] = [
  { key: ProductCollection.DOG, label: "Dogs", icon: "🐶", subtitle: "Find your perfect furry friend", leftImg: "/img/It1.jpg", rightImg: "/img/itButton.png" },
  { key: ProductCollection.CAT, label: "Cats", icon: "🐱", subtitle: "Meet your cuddly companion", leftImg: "/img/cat2.jpg", rightImg: "/img/mushukButton.png" },
  { key: ProductCollection.BIRD, label: "Birds", icon: "🐤", subtitle: "Cheerful feathered friends", leftImg: "/img/SBird.jpg", rightImg: "/img/birdButton.png" },
  { key: ProductCollection.FISH, label: "Fish", icon: "🐠", subtitle: "Calm and colourful aquatic pets", leftImg: "/img/Nemo.jpg", rightImg: "/img/home/fish.webp" },
  { key: ProductCollection.RABBIT, label: "Rabbits", icon: "🐰", subtitle: "Soft and gentle little friends", leftImg: "/img/QUyon.jpg", rightImg: "/img/rabbitButton.png" },
  { key: ProductCollection.ACCESSORY, label: "Accessories", icon: "🧸", subtitle: "Everything your pet needs", leftImg: "/img/home/item2.jpg", rightImg: "/img/AcButton.png" },
];

const SPECIES_LABEL: Record<string, string> = {
  DOG: "Dog",
  CAT: "Cat",
  BIRD: "Bird",
  FISH: "Fish",
  RABBIT: "Rabbit",
  ACCESSORY: "Accessory",
};

const TRUST = [
  { icon: "🛡️", title: "Healthy Pets", desc: "Checked & Vaccinated" },
  { icon: "❤️", title: "Safe Adoption", desc: "Trusted Process" },
  { icon: "👨‍👩‍👧", title: "Happy Families", desc: "Join Our Community" },
  { icon: "🎧", title: "24/7 Support", desc: "We're Here to Help" },
];

type SortKey = "newest" | "priceLow" | "priceHigh";

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const history = useHistory();
  const location = useLocation();

  const collectionFromUrl = (): ProductCollection => {
    const raw = new URLSearchParams(location.search).get("collection");
    const found = COLLECTIONS.find((c) => c.key === raw);
    return found ? found.key : ProductCollection.DOG;
  };

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 5,
    order: "createdAt",
    productCollection: collectionFromUrl(),
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("newest");

  // Sync collection when the URL query changes (navbar Dogs/Cats links)
  useEffect(() => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      productCollection: collectionFromUrl(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  const activeMeta =
    COLLECTIONS.find((c) => c.key === productSearch.productCollection) ??
    COLLECTIONS[0];

  // client-side direction for price (backend sorts productPrice ascending)
  const displayed = useMemo(() => {
    const list = [...products];
    if (sort === "priceHigh") list.sort((a, b) => b.productPrice - a.productPrice);
    else if (sort === "priceLow") list.sort((a, b) => a.productPrice - b.productPrice);
    return list;
  }, [products, sort]);

  /** Handlers */
  const chooseCollection = (c: ProductCollection) => {
    history.push(`/products?collection=${c}`);
  };

  const changeSort = (value: SortKey) => {
    setSort(value);
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      order: value === "newest" ? "createdAt" : "productPrice",
    }));
  };

  const searchProductHandler = () => {
    setProductSearch((prev) => ({ ...prev, page: 1, search: searchText }));
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    setProductSearch((prev) => ({ ...prev, page: value }));
  };

  const chooseProduct = (id: string) => history.push(`/products/${id}`);

  return (
    <div className="pets-page">
      {/* ===== Header ===== */}
      <div className="pets-header">
        <div className="pets-wrap">
          <div className="pets-head-top">
            <img
              className="pets-head-left"
              src={activeMeta.leftImg}
              alt={activeMeta.label}
            />
            <div className="pets-head-mid">
              <div className="pets-breadcrumb">
                <span onClick={() => history.push("/")}>Home</span>
                <i>›</i>
                <span>Pets</span>
                <i>›</i>
                <b>{activeMeta.label}</b>
              </div>
              <h1 className="pets-title">{activeMeta.label}</h1>
              <p className="pets-subtitle">{activeMeta.subtitle}</p>
            </div>
            <img
              className="pets-head-right"
              src={activeMeta.rightImg}
              alt=""
            />
          </div>

          <div className="pets-trust">
            {TRUST.map((t) => (
              <div key={t.title} className="pets-trust-item">
                <span className="pt-ico" role="img" aria-label={t.title}>
                  {t.icon}
                </span>
                <div>
                  <div className="pt-title">{t.title}</div>
                  <div className="pt-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="pets-wrap pets-body">
        {/* Sidebar */}
        <aside className="pets-sidebar">
          <div className="ps-title">Categories</div>
          <div className="ps-cats">
            {COLLECTIONS.map((c) => (
              <button
                key={c.key}
                className={
                  "ps-cat" +
                  (productSearch.productCollection === c.key ? " active" : "")
                }
                onClick={() => chooseCollection(c.key)}
              >
                <span className="ps-cat-ico">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="pets-main">
          <div className="pets-toolbar">
            <div className="pets-search">
              <input
                type="text"
                placeholder={`Search ${activeMeta.label.toLowerCase()} by name or keyword...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProductHandler();
                }}
              />
              <button onClick={searchProductHandler}>🔍</button>
            </div>

            <div className="pets-sort">
              <label>Sort by:</label>
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => changeSort(e.target.value as SortKey)}
              >
                <option value="newest">Newest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="pets-count">
            {displayed.length} {activeMeta.label.toLowerCase()} found
          </div>

          <div className="pets-grid">
            {displayed.length !== 0 ? (
              displayed.map((product) => {
                const imagePath = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/img/home/pet1.webp";
                const flag = product.productViews > 0 ? "Popular" : "New";
                return (
                  <div
                    key={product._id}
                    className="pet-item-card"
                    onClick={() => chooseProduct(product._id)}
                  >
                    <div
                      className="pic-photo"
                      style={{ backgroundImage: `url(${imagePath})` }}
                    >
                      <span
                        className={
                          "pic-flag " + (flag === "Popular" ? "popular" : "new")
                        }
                      >
                        {flag}
                      </span>
                      <FavoriteButton id={product._id} className="pic-fav" />
                    </div>

                    <div className="pic-body">
                      <div className="pic-name">{product.productName}</div>
                      <div className="pic-meta">
                        {SPECIES_LABEL[product.productCollection] ?? "Pet"} ·{" "}
                        {product.productSize}
                      </div>
                      <div className="pic-foot">
                        <span className="pic-price">
                          ₩{product.productPrice}
                        </span>
                        <div className="pic-actions">
                          <Badge
                            badgeContent={product.productViews}
                            color="primary"
                          >
                            <RemoveRedEyeIcon sx={{ fontSize: 20 }} />
                          </Badge>
                          <button
                            className="pic-cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAdd({
                                _id: product._id,
                                quantity: 1,
                                name: product.productName,
                                price: product.productPrice,
                                image: product.productImages?.[0] ?? "",
                              });
                            }}
                          >
                            🛒
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pets-empty">
                No {activeMeta.label.toLowerCase()} available yet.
              </div>
            )}
          </div>

          <div className="pets-pagination">
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color={"primary"}
                />
              )}
              onChange={paginationHandler}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
