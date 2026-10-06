import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Messages, getImageUrl } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import {
  sweetConfirmProvider,
  sweetErrorHandling,
} from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../components/hooks/useGlobals";
import OrderService from "../../services/OrdersService";

const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders }),
);

export default function FinishedOrders() {
  const { authMember, setOrderBuilder } = useGlobals();
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  const removeOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmed = await sweetConfirmProvider(
        "Remove this order from your history?",
        "Remove",
      );
      if (confirmed) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"3"}>
      <Stack>
        {finishedOrders.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}>
              <Box className={"order-status-badge finished"}>Completed</Box>
              <Box className={"order-box-scroll"}>
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id,
                  )[0];
                  const imagePath = getImageUrl(product.productImages[0]);
                  return (
                    <Box key={item._id} className={"orders-name-price"}>
                      <img src={imagePath} className={"order-dish-img"} alt="" />

                      <p className={"title-dish"}>{product.productName}</p>
                      <Box className={"price-box"}>
                        <p>₩{item.itemPrice}</p>
                        <img src={"/icons/close.svg"} alt="" />
                        <p>{item.itemQuantity}</p>
                        <img src={"/icons/pause.svg"} alt="" />
                        <p style={{ marginLeft: "15px" }}>
                          {" "}
                          ₩{item.itemQuantity * item.itemPrice}
                        </p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Box className={"total-price-box"}>
                <Box className={"box-total"}>
                  <p>Product price</p>
                  <p>₩{order.orderTotal - order.orderDelivery}</p>
                  <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} alt="" />
                  <p>Delivery cost</p>
                  <p>₩{order.orderDelivery}</p>
                  <img
                    src={"/icons/pause.svg"}
                    style={{ marginLeft: "20px" }}
                    alt=""
                  />
                  <p>Total</p>
                  <p>₩{order.orderTotal}</p>
                </Box>
                <p className={"data-compl"}>
                  {moment(order.updatedAt).format("YY-MM-DD HH:mm")}
                </p>
                <Button
                  variant="contained"
                  color="secondary"
                  className={"cancel-button"}
                  onClick={() => removeOrderHandler(order._id)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          );
        })}

        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box className={"order-empty"}>
            <img src={"/icons/noimage-list.svg"} alt="no orders" />
            <span>No finished orders yet</span>
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
