import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Box, Container, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { calcTotals } from "../../../lib/utils/price";
import { isUniquePet } from "../../../lib/utils/cart";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../components/hooks/useGlobals";
import OrderService from "../../services/OrdersService";
import "../../../css/pettynara-checkout.css";

/** route state survives navigation but not a hard refresh — sessionStorage backs
 *  up the "buy now" item so F5 on /checkout does not blank the page. */
const CHECKOUT_KEY = "pettynara_checkout";

type CheckoutMode = "buyNow" | "cart";

interface CheckoutState {
  mode?: CheckoutMode;
  item?: CartItem;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

const readBuyNowItem = (state?: CheckoutState): CartItem | null => {
  if (state?.item) {
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(state.item));
    return state.item;
  }
  // arriving from the basket: drop any leftover buy-now item so a refresh
  // cannot resurrect it as the wrong mode
  if (state?.mode === "cart") {
    sessionStorage.removeItem(CHECKOUT_KEY);
    return null;
  }
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as CartItem) : null;
  } catch (e) {
    return null;
  }
};

export default function CheckoutPage(props: CheckoutPageProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const location = useLocation<CheckoutState | undefined>();
  const submittedRef = useRef(false);

  const [buyNowItem] = useState<CartItem | null>(() =>
    readBuyNowItem(location.state),
  );
  const [buyNowQty, setBuyNowQty] = useState<number>(buyNowItem?.quantity ?? 1);

  const mode: CheckoutMode = buyNowItem ? "buyNow" : "cart";

  const items: CartItem[] = useMemo(
    () => (buyNowItem ? [{ ...buyNowItem, quantity: buyNowQty }] : cartItems),
    [buyNowItem, buyNowQty, cartItems],
  );

  const { itemsPrice, shippingCost, totalPrice } = calcTotals(items);

  // nothing to check out (direct URL, or every line removed) → back to the shop
  useEffect(() => {
    if (!submittedRef.current && items.length === 0) {
      history.replace("/products");
    }
  }, [items.length, history]);

  /** HANDLERS **/
  const increaseHandler = (item: CartItem) => {
    if (isUniquePet(item)) return; // stepper is hidden for pets, but never stack one
    if (mode === "buyNow") setBuyNowQty((q) => q + 1);
    else onAdd(item);
  };

  const decreaseHandler = (item: CartItem) => {
    if (mode === "buyNow") setBuyNowQty((q) => (q > 1 ? q - 1 : 1));
    else onRemove(item);
  };

  const removeLineHandler = (item: CartItem) => {
    if (mode === "buyNow") {
      sessionStorage.removeItem(CHECKOUT_KEY);
      history.replace("/products");
    } else onDelete(item);
  };

  const confirmOrderHandler = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      submittedRef.current = true;

      const order = new OrderService();
      await order.createOrder(items);

      if (mode === "cart") onDeleteAll();
      else sessionStorage.removeItem(CHECKOUT_KEY);

      setOrderBuilder(new Date());
      history.replace("/orders");
    } catch (err) {
      submittedRef.current = false;
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  if (items.length === 0) return null;

  return (
    <div className={"checkout-page"}>
      <Container className={"checkout-container"}>
        <Box className={"checkout-heading"}>
          <h1>Checkout</h1>
          <p>Review your order before we start preparing it. 🐾</p>
        </Box>

        {/* LEFT SIDE */}
        <Stack className={"checkout-left"}>
          <Box className={"checkout-card"}>
            <Box className={"checkout-card-head"}>
              <span className={"checkout-card-title"}>
                {mode === "buyNow" ? "Direct purchase" : "Your basket"}
              </span>
              <span className={"checkout-card-count"}>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </Box>

            <Box className={"checkout-lines"}>
              {items.map((item: CartItem) => {
                const imagePath = item.image
                  ? `${serverApi}/${item.image}`
                  : "/img/home/pet1.webp";
                return (
                  <Box className={"checkout-line"} key={item._id}>
                    <img
                      src={imagePath}
                      className={"checkout-line-img"}
                      alt={item.name}
                    />

                    <Box className={"checkout-line-info"}>
                      <span className={"checkout-line-name"}>{item.name}</span>
                      <span className={"checkout-line-unit"}>
                        ₩{item.price} each
                      </span>
                    </Box>

                    {/* a listed animal is one individual — no stepper, the
                        quantity is fixed at 1. Accessories are ordinary stock
                        and keep the +/− controls. */}
                    {isUniquePet(item) ? (
                      <Box className={"checkout-qty checkout-qty-fixed"}>
                        <span className={"checkout-qty-value"}>1</span>
                        <span className={"checkout-qty-note"}>only one</span>
                      </Box>
                    ) : (
                      <Box className={"checkout-qty"}>
                        <button
                          className={"checkout-qty-btn"}
                          onClick={() => decreaseHandler(item)}
                          aria-label="decrease quantity"
                        >
                          −
                        </button>
                        <span className={"checkout-qty-value"}>
                          {item.quantity}
                        </span>
                        <button
                          className={"checkout-qty-btn"}
                          onClick={() => increaseHandler(item)}
                          aria-label="increase quantity"
                        >
                          +
                        </button>
                      </Box>
                    )}

                    <span className={"checkout-line-total"}>
                      ₩{item.price * item.quantity}
                    </span>

                    <button
                      className={"checkout-line-remove"}
                      onClick={() => removeLineHandler(item)}
                      aria-label="remove item"
                    >
                      ✕
                    </button>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box className={"checkout-card checkout-summary"}>
            <span className={"checkout-card-title"}>Order summary</span>

            <Box className={"checkout-sum-row"}>
              <span>Subtotal</span>
              <span>₩{itemsPrice}</span>
            </Box>
            <Box className={"checkout-sum-row"}>
              <span>Delivery</span>
              <span>{shippingCost === 0 ? "Free" : `₩${shippingCost}`}</span>
            </Box>
            <Box className={"checkout-sum-row total"}>
              <span>Total</span>
              <span>₩{totalPrice}</span>
            </Box>

            <Button
              onClick={confirmOrderHandler}
              startIcon={<ShoppingCartIcon />}
              variant={"contained"}
              className={"checkout-confirm"}
            >
              Confirm Order
            </Button>

            <button
              className={"checkout-continue"}
              onClick={() => history.push("/products")}
            >
              Continue shopping
            </button>
          </Box>
        </Stack>

        {/* RIGHT SIDE */}
        <Stack className={"checkout-right"}>
          <Box className={"checkout-info-box"}>
            <Box className={"checkout-member-box"}>
              <img
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
                className={"checkout-user-avatar"}
                alt="user"
              />
              <span className={"checkout-user-name"}>
                {authMember?.memberNick ?? "User"}
              </span>
              <span className={"checkout-user-prof"}>
                {authMember?.memberType ?? "User"}
              </span>
            </Box>

            <Box className={"checkout-liner"} />

            <Box className={"checkout-user-address"}>
              <LocationOnIcon />
              <span>
                {authMember?.memberAddress
                  ? authMember.memberAddress
                  : "no address"}
              </span>
            </Box>
          </Box>

          <Box className={"checkout-benefits"}>
            <Box className={"checkout-benefit-row"}>
              <span className={"checkout-benefit-icon"}>
                <HealthAndSafetyIcon />
              </span>
              <span className={"checkout-benefit-text"}>
                <b>Health Checked</b>
                <span>All pets are vet-checked</span>
              </span>
            </Box>
            <Box className={"checkout-benefit-row"}>
              <span className={"checkout-benefit-icon"}>
                <LocalShippingIcon />
              </span>
              <span className={"checkout-benefit-text"}>
                <b>Safe Delivery</b>
                <span>Professional pet transport</span>
              </span>
            </Box>
            <Box className={"checkout-benefit-row"}>
              <span className={"checkout-benefit-icon"}>
                <VerifiedUserIcon />
              </span>
              <span className={"checkout-benefit-text"}>
                <b>14-Day Health Guarantee</b>
                <span>Full support after delivery</span>
              </span>
            </Box>
            <Box className={"checkout-benefit-row"}>
              <span className={"checkout-benefit-icon"}>
                <SupportAgentIcon />
              </span>
              <span className={"checkout-benefit-text"}>
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
