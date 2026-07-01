import React, { useEffect } from "react";
import Hero from "./Hero";
import CategoryRow from "./CategoryRow";
import PetHelpers from "./PetHelpers";
import PopularPets from "./PopularPets";
import Accessories from "./Accessories";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import "../../../css/home.css";
import "../../../css/pettynara-home.css";
import MemberService from "../../services/memberService";
import { Member } from "../../../lib/types/member";

//** redux slice and selector **//

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
  const { setPopularDishes, setNewDishes, setTopUsers } =
    actionDispatch(useDispatch());

  useEffect(() => {
    // Backend server data request => data
    const product = new ProductService();
    // Popular Pets: all animals ordered by views (mixed collections)
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
      })
      .then((data) => setPopularDishes(data))
      .catch((err) => console.log(err));

    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "createdAt",
        productCollection: ProductCollection.ACCESSORY,
      })
      .then((data) => setNewDishes(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={"pettynara-home"}>
      <Hero />
      <CategoryRow />
      <PetHelpers />
      <PopularPets />
      <Accessories />
    </div>
  );
}
