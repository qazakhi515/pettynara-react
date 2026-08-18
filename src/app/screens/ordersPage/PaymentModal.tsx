import { useEffect, useState } from "react";
import { Backdrop, Box, Fade, Modal, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import { Messages } from "../../../lib/config";
import { Order } from "../../../lib/types/order";
import { T } from "../../../lib/types/common";
import {
  DEMO_CARD_CVV,
  DEMO_CARD_EXPIRY,
  DEMO_CARD_NUMBER,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  maskCard,
  readSavedCard,
  saveCard,
} from "../../../lib/utils/card";
import "../../../css/pettynara-payment.css";

interface PaymentModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  /** the API call lives in the parent — this modal only collects the card */
  onConfirm: (orderId: string) => Promise<void>;
}

export default function PaymentModal(props: PaymentModalProps) {
  const { open, order, onClose, onConfirm } = props;

  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [holder, setHolder] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(true);
  const [paying, setPaying] = useState<boolean>(false);
  // shown inside the modal: a SweetAlert would render behind the MUI backdrop
  const [error, setError] = useState<string>("");

  const savedCard = readSavedCard();

  // reset on every open: the number and the CVV are never pre-filled, only the
  // two harmless fields come back from the saved card
  useEffect(() => {
    if (!open) return;
    const saved = readSavedCard();
    setCardNumber("");
    setCvv("");
    setExpiry(saved?.expiry ?? "");
    setHolder(saved?.holder ?? "");
    setPaying(false);
    setError("");
  }, [open]);

  /** HANDLERS **/
  const handleCardNumber = (e: T) => {
    setError("");
    setCardNumber(formatCardNumber(e.target.value));
  };
  const handleExpiry = (e: T) => setExpiry(formatExpiry(e.target.value));
  const handleCvv = (e: T) =>
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
  const handleHolder = (e: T) => {
    setError("");
    setHolder(e.target.value);
  };

  const useDemoCardHandler = () => {
    setError("");
    setCardNumber(DEMO_CARD_NUMBER);
    setExpiry(DEMO_CARD_EXPIRY);
    setCvv(DEMO_CARD_CVV);
    if (holder === "") setHolder("DEMO USER");
  };

  const payHandler = async () => {
    if (!order || paying) return;

    // This is a demo checkout — nothing is charged and no card data is sent
    // anywhere, so an incomplete form must never block the order. Whatever is
    // missing simply falls back to the demo card instead of raising an error.
    // (The number input strips non-digits, so typing e.g. "demo" leaves it
    // empty — that used to dead-end here with a validation message.)
    const payCard =
      digitsOnly(cardNumber).length >= 4 ? cardNumber : DEMO_CARD_NUMBER;
    const payExpiry = expiry.trim() !== "" ? expiry : DEMO_CARD_EXPIRY;
    const payHolder = holder.trim() !== "" ? holder : "DEMO USER";

    // reflect the substitution in the form so the user sees what was charged
    setCardNumber(payCard);
    setExpiry(payExpiry);
    setHolder(payHolder);

    try {
      setPaying(true);
      setError("");
      // only the holder, the expiry and the last 4 digits are kept
      if (remember) saveCard(payHolder, payExpiry, payCard);

      await onConfirm(order._id);
      onClose();
    } catch (err: any) {
      setPaying(false);
      console.log("payment failed:", err);
      // the error has to be rendered in the modal — a SweetAlert would open
      // behind the MUI backdrop and the user would see nothing happen
      setError(
        err?.response?.data?.message ?? err?.message ?? Messages.error1,
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400 } }}
      className={"pay-modal-root"}
    >
      <Fade in={open}>
        <Stack className={"pay-modal"}>
          <Box className={"pay-head"}>
            <span className={"pay-title"}>
              <CreditCardIcon /> Payment
            </span>
            <span className={"pay-amount"}>₩{order?.orderTotal ?? 0}</span>
          </Box>

          <Box className={"pay-notice"}>
            <span>
              ⚠️ Demo payment — no money moves and nothing is sent to a server.
              Please do <b>not</b> enter a real card. Leave the fields blank (or
              hit the button below) and the demo card is used automatically.
            </span>
            <button className={"pay-demo-btn"} onClick={useDemoCardHandler}>
              Use demo card
            </button>
          </Box>

          <Box className={"pay-field"}>
            <label>Card number</label>
            <input
              className={"pay-input"}
              value={cardNumber}
              onChange={handleCardNumber}
              autoComplete="off"
              inputMode="numeric"
              placeholder={
                savedCard ? maskCard(savedCard.last4) : "0000 0000 0000 0000"
              }
            />
          </Box>

          <Box className={"pay-row"}>
            <Box className={"pay-field"}>
              <label>Expiry</label>
              <input
                className={"pay-input"}
                value={expiry}
                onChange={handleExpiry}
                autoComplete="off"
                inputMode="numeric"
                placeholder="MM/YY"
              />
            </Box>
            <Box className={"pay-field"}>
              <label>CVV</label>
              <input
                className={"pay-input"}
                type="password"
                value={cvv}
                onChange={handleCvv}
                autoComplete="off"
                inputMode="numeric"
                placeholder="•••"
              />
            </Box>
          </Box>

          <Box className={"pay-field"}>
            <label>Cardholder name</label>
            <input
              className={"pay-input"}
              value={holder}
              onChange={handleHolder}
              autoComplete="off"
              placeholder="AKHMADJON USMONOV"
            />
          </Box>

          <label className={"pay-remember"}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span>Remember this card (name, expiry and last 4 digits only)</span>
          </label>

          {error !== "" && <Box className={"pay-error"}>⚠️ {error}</Box>}

          <Button
            variant={"contained"}
            className={"pay-submit"}
            onClick={payHandler}
            disabled={paying}
          >
            {paying ? "Processing…" : `Pay ₩${order?.orderTotal ?? 0}`}
          </Button>

          <Box className={"pay-foot"}>
            <LockIcon /> Card details never leave this browser
          </Box>
        </Stack>
      </Fade>
    </Modal>
  );
}
