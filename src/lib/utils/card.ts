/** Demo payment card helpers.
 *
 *  SECURITY RULE — the full card number and the CVV are NEVER persisted and are
 *  NEVER sent anywhere. Only the cardholder name, the expiry and the last four
 *  digits are kept, purely so the UI can show "•••• 4242" on the next visit.
 */

export interface SavedCard {
  holder: string;
  expiry: string;
  last4: string;
}

export const CARD_KEY = "pettynara_card";
export const DEMO_CARD_NUMBER = "4242 4242 4242 4242";
export const DEMO_CARD_EXPIRY = "07/28";
export const DEMO_CARD_CVV = "123";

export const digitsOnly = (value: string): string => value.replace(/\D/g, "");

/** "4242424242424242" → "4242 4242 4242 4242" (capped at 16 digits) */
export const formatCardNumber = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
};

/** "0728" → "07/28" (capped at 4 digits) */
export const formatExpiry = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const maskCard = (last4: string): string => `•••• •••• •••• ${last4}`;

export const readSavedCard = (): SavedCard | null => {
  try {
    const raw = localStorage.getItem(CARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedCard;
    return parsed?.last4 ? parsed : null;
  } catch (e) {
    return null;
  }
};

/** Takes the typed card number only to slice off its last 4 digits — the rest
 *  is discarded on the spot and never leaves this function. */
export const saveCard = (
  holder: string,
  expiry: string,
  cardNumber: string,
): void => {
  const digits = digitsOnly(cardNumber);
  const card: SavedCard = {
    holder: holder.trim(),
    expiry: expiry.trim(),
    last4: digits.slice(-4),
  };
  // Remembering the card is a convenience — private mode / a full quota makes
  // setItem throw, and that must never abort the payment itself.
  try {
    localStorage.setItem(CARD_KEY, JSON.stringify(card));
  } catch (e) {
    console.log("saveCard skipped:", e);
  }
};

export const clearSavedCard = (): void => {
  localStorage.removeItem(CARD_KEY);
};
