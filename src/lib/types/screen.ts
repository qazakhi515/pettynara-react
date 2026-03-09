import { Member } from "./member";
import { Product } from "./product";

/**  React app state **/
export interface AppRootState {
  homePage: HomePageState;

  //productsPage:ProductsPageState;
  //ordersPage: OrdersPageState;
}

export interface HomePageState {
  popularDishes: Product[];
  newDishes: Product[];
  topUsers: Member[];
}

/** Products Page **/
// export interface
/** Orders Page **/
// export interface
