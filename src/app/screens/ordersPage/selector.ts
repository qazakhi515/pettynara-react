import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectOrdersPage = (state: AppRootState) => state.ordersPage;

export const retrievePausedOrders = createSelector(
  selectOrdersPage,
  (OrdersPage) => OrdersPage.pausedOrders,
);

export const retrieveProcessOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.processOrders,
);

export const retrieveFinishedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.finishedOrders,
);
