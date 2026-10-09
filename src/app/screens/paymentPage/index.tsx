import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Container, Stack } from "@mui/material";
import OrderService from "../../services/OrdersService";
import { useGlobals } from "../../components/hooks/useGlobals";
import { Messages } from "../../../lib/config";
import "../../../css/pettynara-payment.css";

type Result =
  | { state: "confirming" }
  | { state: "paid"; amount: number }
  | { state: "failed"; message: string };

/**
 * Toss Payments sends the buyer back here.
 *  - /payment/success?paymentKey&orderId&amount: ask the server to confirm.
 *    The payment is not complete until that call succeeds.
 *  - /payment/fail?code&message: the buyer cancelled or the card was refused.
 */
export default function PaymentResultPage() {
  const { outcome } = useParams<{ outcome: string }>();
  const location = useLocation();
  const history = useHistory();
  const { setOrderBuilder } = useGlobals();
  const [result, setResult] = useState<Result>({ state: "confirming" });
  // React may run the effect twice in development; confirm only once.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const query = new URLSearchParams(location.search);

    if (outcome !== "success") {
      setResult({
        state: "failed",
        message: query.get("message") ?? "The payment was cancelled.",
      });
      return;
    }

    const paymentKey = query.get("paymentKey") ?? "";
    const orderId = query.get("orderId") ?? "";
    const amount = Number(query.get("amount"));

    new OrderService()
      .confirmPayment({ paymentKey, orderId, amount })
      .then(() => {
        setOrderBuilder(new Date());
        setResult({ state: "paid", amount });
      })
      .catch((err: any) =>
        setResult({
          state: "failed",
          message: err?.response?.data?.message ?? Messages.error1,
        }),
      );
  }, [outcome, location.search, setOrderBuilder]);

  return (
    <Container className={"pay-result"}>
      <Stack className={"pay-result-card"}>
        {result.state === "confirming" && (
          <>
            <CircularProgress />
            <h2>Confirming your payment…</h2>
            <p>Please don't close this page.</p>
          </>
        )}

        {result.state === "paid" && (
          <>
            <Box className={"pay-result-icon"}>✅</Box>
            <h2>Payment complete</h2>
            <p>₩{result.amount} was paid. Your order is now being processed.</p>
            <Button
              variant={"contained"}
              className={"pay-submit"}
              onClick={() => history.replace("/orders?tab=2")}
            >
              View my orders
            </Button>
          </>
        )}

        {result.state === "failed" && (
          <>
            <Box className={"pay-result-icon"}>⚠️</Box>
            <h2>Payment not completed</h2>
            <p>{result.message}</p>
            <p>Your order is still waiting for payment, so you can try again.</p>
            <Button
              variant={"contained"}
              className={"pay-submit"}
              onClick={() => history.replace("/orders?tab=1")}
            >
              Back to my orders
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
}
