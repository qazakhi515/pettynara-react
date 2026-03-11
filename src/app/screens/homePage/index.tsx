import React, { useEffect } from "react";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewDishes from "./NewDishes";
import PopularDishes from "./PopularDishes";
import Statistics from "./Statistics";
import "../../../css/home.css";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { setPopularDishes } from "./slice";
import { Product } from "../../../lib/types/product";

//** redux slice and selector **//

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});
const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes }),
);

export default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());
  const { popularDishes } = useSelector(popularDishesRetriever);
  // Selector
  useEffect(() => {
    //Backend server data request => data
    const result = [
      {
        _id: "6988483ed71d8f801a8e3a64",
        productStatus: "PROCESS",
        productCollection: "DISH",
        productName: "Somsa",
        productPrice: 6,
        productLeftCount: 200,
        productSize: "LARGE",
        productVolume: "1",
        productDesc: " Famous Vodiy maydon somsa",
        productImages: [
          "uploads/products/2133f997-9b61-4167-8238-dd0f1570c136.jpg",
        ],
        productViews: 0,
        createdAt: "2026-02-08T08:24:30.398Z",
        updatedAt: "2026-02-08T14:00:44.347Z",
        __v: 0,
      },
    ];
    // Slice : Data => Store
    //@ts-ignore
    setPopularDishes(result);
  }, []);

  console.log("popularDishes", popularDishes);
  return (
    <div className={"homepage"}>
      <Statistics />
      <PopularDishes />
      <NewDishes />
      <Advertisement />
      <ActiveUsers />
      <Events />
    </div>
  );
}
