import { useEffect, useRef, useState } from "react";
import { Backdrop, Box, Fade, Modal, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import {
  ANONYMOUS,
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { Messages, tossClientKey } from "../../../lib/config";
import { Order } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import "../../../css/pettynara-payment.css";

interface PaymentModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

/**
 * The Toss orderId for one payment attempt: our order id plus a random suffix,
 * so a buyer who closes the payment window can try again. The server reads
 * the order id back from the part before "_".
 */
const makeTossOrderId = (orderId: string) =>
  `${orderId}_${Math.random().toString(36).slice(2, 10)}`;

/** "Bichon" or "Bichon 외 2건", the way Korean checkouts name an order. */
const makeOrderName = (order: Order): string => {
  const first: Product | undefined = order.productData?.[0];
  const name = first?.productName ?? "Pettynara order";
  const others = (order.orderItems?.length ?? 1) - 1;
  return others > 0 ? `${name} 외 ${others}건` : name;
};

/**
 * Toss Payments widget for one unpaid order. Paying redirects to Toss and then
 * to /payment/success, where the server confirms the payment; nothing is
 * charged in this component.
 */
export default function PaymentModal(props: PaymentModalProps) {
  const { open, order, onClose } = props;
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [paying, setPaying] = useState<boolean>(false);
  // shown inside the modal: a SweetAlert would render behind the MUI backdrop
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open || !order) return;
    let cancelled = false;
    setReady(false);
    setPaying(false);
    setError("");

    const render = async () => {
      try {
        if (!tossClientKey) throw new Error("Payment is not configured");
        const tossPayments = await loadTossPayments(tossClientKey);
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        // The amount must be set before the payment UI is rendered.
        await widgets.setAmount({ currency: "KRW", value: order.orderTotal });
        if (cancelled) return;
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#toss-payment-methods",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({ selector: "#toss-agreement" }),
        ]);
        if (cancelled) return;
        widgetsRef.current = widgets;
        setReady(true);
      } catch (err: any) {
        console.log("Toss widget failed:", err);
        if (!cancelled) setError(err?.message ?? Messages.error1);
      }
    };
    // The modal mounts its content in a portal; wait one frame for the
    // selectors above to exist.
    const frame = requestAnimationFrame(() => void render());

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      widgetsRef.current = null;
    };
  }, [open, order]);

  const payHandler = async () => {
    const widgets = widgetsRef.current;
    if (!order || !widgets || paying) return;
    try {
      setPaying(true);
      setError("");
      await widgets.requestPayment({
        orderId: makeTossOrderId(order._id),
        orderName: makeOrderName(order),
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err: any) {
      // Closing the Toss window lands here too; the order stays unpaid.
      setPaying(false);
      console.log("Toss requestPayment:", err);
      setError(err?.message ?? Messages.error1);
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
              ⚠️ Test mode — Toss Payments test keys are used, so no money
              moves. Pick any payment method and follow the test screens.
            </span>
          </Box>

          <div id="toss-payment-methods" />
          <div id="toss-agreement" />

          {error !== "" && <Box className={"pay-error"}>⚠️ {error}</Box>}

          <Button
            variant={"contained"}
            className={"pay-submit"}
            onClick={payHandler}
            disabled={!ready || paying}
          >
            {paying
              ? "Processing…"
              : ready
                ? `Pay ₩${order?.orderTotal ?? 0}`
                : "Loading payment methods…"}
          </Button>

          <Box className={"pay-foot"}>
            <LockIcon /> Payments are processed by Toss Payments
          </Box>
        </Stack>
      </Fade>
    </Modal>
  );
}
