import { Member } from "./member";
import { Product } from "./product";

/**  React app state **/
export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;

  //productsPage:ProductsPageState;
  //ordersPage: OrdersPageState;
}

export interface HomePageState {
  popularDishes: Product[];
  newDishes: Product[];
  topUsers: Member[];
}

/** Products Page **/
export interface ProductsPageState {
  restaurant: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}
// export interface
/** Orders Page **/
// export interface
