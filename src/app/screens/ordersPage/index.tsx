import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import "../../../css/order.css";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrdersService";
import { useGlobals } from "../../components/hooks/useGlobals";
import { useHistory } from "react-router-dom";

//** redux slice and selector **//

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});
export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={"order-page"}>
      <Container className={"order-container"}>
        {/* LEFT SIDE */}
        <Stack className={"order-left"}>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
            </Box>

            <Stack className={"order-main-content"}>
              <TabPanel value="1" sx={{ p: 0 }}>
                <PausedOrders setValue={setValue} />
              </TabPanel>

              <TabPanel value="2" sx={{ p: 0 }}>
                <ProcessOrders setValue={setValue} />
              </TabPanel>

              <TabPanel value="3" sx={{ p: 0 }}>
                <FinishedOrders />
              </TabPanel>
            </Stack>
          </TabContext>
        </Stack>

        {/* RIGHT SIDE */}
        <Stack className={"order-right"}>
          {/* USER INFO BOX */}
          <Box className={"order-info-box"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img
                  src={"/icons/default-user.svg"}
                  className={"order-user-avatar"}
                  alt="user"
                />
                <div className={"order-user-icon-box"}>
                  <img
                    src={"/icons/user-badge.svg"}
                    className={"order-user-prof-img"}
                    alt="badge"
                  />
                </div>
              </div>

              <span className={"order-user-name"}>Justin</span>
              <span className={"order-user-prof"}>User</span>
            </Box>

            <Box className={"liner"} />

            <Box className={"order-user-address"}>
              <LocationOnIcon />
              <span className={"spec-address-txt"}>Busan, Korea</span>
            </Box>
          </Box>

          <Box className={"order-info-box"}>
            <input
              className={"card-input"}
              placeholder="Card number : **** 4090 2002 7495"
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <input className={"card-half-input"} placeholder="07 / 24" />
              <input className={"card-half-input"} placeholder="CVV : 010" />
            </Box>

            <input className={"card-input"} placeholder="Justin Robertson" />

            <Box className={"cards-box"}>
              <img src={"/icons/western-card.svg"} alt="western union" />
              <img src={"/icons/master-card.svg"} alt="mastercard" />
              <img src={"/icons/paypal-card.svg"} alt="paypal" />
              <img src={"/icons/visa-card.svg"} alt="visa" />
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
