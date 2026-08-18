import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import "../../../css/order.css";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Messages, serverApi } from "../../../lib/config";
import { T } from "../../../lib/types/common";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import {
  clearSavedCard,
  formatCardNumber,
  formatExpiry,
  maskCard,
  readSavedCard,
  saveCard,
  SavedCard,
} from "../../../lib/utils/card";
import OrderService from "../../services/OrdersService";
import { useGlobals } from "../../components/hooks/useGlobals";

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
  const [value, setValue] = useState("1");
  const [orderInquiry] = useState<OrderInquiry>({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  /** SAVED CARD — only the holder, the expiry and the last 4 digits are ever
   *  stored; the full number and the CVV stay in this component's state. **/
  const [savedCard, setSavedCard] = useState<SavedCard | null>(() =>
    readSavedCard(),
  );
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>(
    () => readSavedCard()?.expiry ?? "",
  );
  const [cardCvv, setCardCvv] = useState<string>("");
  const [cardHolder, setCardHolder] = useState<string>(
    () => readSavedCard()?.holder ?? "",
  );

  const saveCardHandler = () => {
    try {
      const isFulfill =
        cardNumber !== "" && cardExpiry !== "" && cardHolder !== "";
      if (!isFulfill) throw new Error(Messages.error3);

      saveCard(cardHolder, cardExpiry, cardNumber);
      setSavedCard(readSavedCard());
      setCardNumber("");
      setCardCvv("");
      sweetTopSmallSuccessAlert("Card saved on this device", 1400);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const forgetCardHandler = () => {
    clearSavedCard();
    setSavedCard(null);
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setCardHolder("");
  };

  return (
    <div className={"order-page"}>
      <Container className={"order-container"}>
        {/* PAGE HEADING */}
        <Box className={"order-heading"}>
          <h1>My Orders</h1>
          <p>Track, pay and complete your pet adoptions — all in one place. 🐾</p>
        </Box>

        {/* LEFT SIDE */}
        <Stack className={"order-left"}>
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                >
                  <Tab label="Paused Orders" value={"1"} />
                  <Tab label="Process Orders" value={"2"} />
                  <Tab label="Finished Orders" value={"3"} />
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
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember.memberImage}`
                      : "/icons/default-user.svg"
                  }
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

              <span className={"order-user-name"}>
                {authMember?.memberNick ?? "User"}
              </span>
              <span className={"order-user-prof"}>
                {authMember?.memberType ?? "User"}
              </span>
            </Box>

            <Box className={"liner"} />

            <Box className={"order-user-address"}>
              <LocationOnIcon />
              <span className={"spec-address-txt"}>
                {authMember?.memberAddress
                  ? authMember.memberAddress
                  : "no address"}
              </span>
            </Box>
          </Box>

          {/* PAYMENT CARD */}
          <Box className={"order-info-box payment-box"}>
            <span className={"payment-title"}>
              <CreditCardIcon /> Payment Method
            </span>

            <span className={"payment-note"}>
              Demo only — please don't enter a real card. Nothing is sent to the
              server; only the name, expiry and last 4 digits stay on this
              device.
            </span>

            {savedCard && (
              <Box className={"saved-card-row"}>
                <span>{maskCard(savedCard.last4)}</span>
                <button className={"forget-card"} onClick={forgetCardHandler}>
                  Forget
                </button>
              </Box>
            )}

            <input
              className={"card-input"}
              value={cardNumber}
              onChange={(e: T) => setCardNumber(formatCardNumber(e.target.value))}
              autoComplete="off"
              inputMode="numeric"
              placeholder={
                savedCard
                  ? `Card number : ${maskCard(savedCard.last4)}`
                  : "Card number : 0000 0000 0000 0000"
              }
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <input
                className={"card-half-input"}
                value={cardExpiry}
                onChange={(e: T) => setCardExpiry(formatExpiry(e.target.value))}
                autoComplete="off"
                inputMode="numeric"
                placeholder="MM / YY"
              />
              <input
                className={"card-half-input"}
                type="password"
                value={cardCvv}
                onChange={(e: T) =>
                  setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                autoComplete="off"
                inputMode="numeric"
                placeholder="CVV"
              />
            </Box>

            <input
              className={"card-input"}
              value={cardHolder}
              onChange={(e: T) => setCardHolder(e.target.value)}
              autoComplete="off"
              placeholder="Cardholder name"
            />

            <button className={"save-card"} onClick={saveCardHandler}>
              Save card
            </button>

            <Box className={"cards-box"}>
              <img src={"/icons/western-card.svg"} alt="western union" />
              <img src={"/icons/master-card.svg"} alt="mastercard" />
              <img src={"/icons/paypal-card.svg"} alt="paypal" />
              <img src={"/icons/visa-card.svg"} alt="visa" />
            </Box>
          </Box>

          {/* TRUST BENEFITS */}
          <Box className={"order-benefits"}>
            <Box className={"benefit-row"}>
              <span className={"benefit-icon"}>
                <HealthAndSafetyIcon />
              </span>
              <span className={"benefit-text"}>
                <b>Health Checked</b>
                <span>All pets are vet-checked</span>
              </span>
            </Box>
            <Box className={"benefit-row"}>
              <span className={"benefit-icon"}>
                <LocalShippingIcon />
              </span>
              <span className={"benefit-text"}>
                <b>Safe Delivery</b>
                <span>Professional pet transport</span>
              </span>
            </Box>
            <Box className={"benefit-row"}>
              <span className={"benefit-icon"}>
                <VerifiedUserIcon />
              </span>
              <span className={"benefit-text"}>
                <b>14-Day Health Guarantee</b>
                <span>Full support after delivery</span>
              </span>
            </Box>
            <Box className={"benefit-row"}>
              <span className={"benefit-icon"}>
                <SupportAgentIcon />
              </span>
              <span className={"benefit-text"}>
                <b>24/7 Customer Support</b>
                <span>We are always here to help</span>
              </span>
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
