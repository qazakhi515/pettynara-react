import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import PaymentModal from "./PaymentModal";
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

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders }),
);
interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { authMember, setOrderBuilder } = useGlobals();
  const { setValue } = props;
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  const [payOrder, setPayOrder] = useState<Order | null>(null);

  const deleteOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmed = await sweetConfirmProvider(
        "Cancel this order?",
        "Cancel order",
      );
      if (confirmed) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("1");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"1"}>
      <Stack>
        {pausedOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}>
              <Box className={"order-status-badge paused"}>Awaiting payment</Box>
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
                          ₩{item.itemQuantity * item.itemPrice}{" "}
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
                <Button
                  variant="contained"
                  color="secondary"
                  className={"cancel-button"}
                  onClick={() => deleteOrderHandler(order._id)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className={"pay-button"}
                  onClick={() => setPayOrder(order)}
                >
                  Payment
                </Button>
              </Box>
            </Box>
          );
        })}

        {(!pausedOrders || pausedOrders.length === 0) && (
          <Box className={"order-empty"}>
            <img src={"/icons/noimage-list.svg"} alt="no orders" />
            <span>No paused orders yet</span>
          </Box>
        )}
      </Stack>

      <PaymentModal
        open={!!payOrder}
        order={payOrder}
        onClose={() => setPayOrder(null)}
      />
    </TabPanel>
  );
}
