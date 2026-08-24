/**
 * Phone rules, mirroring the server check in Pettynara/src/libs/config.ts.
 * The form check is only there to explain the problem while typing — the
 * server rejects bad input regardless.
 */

export const PHONE_MIN_DIGITS = 9;
export const PHONE_MAX_DIGITS = 15;

/** Drop anything that is not a digit or a separator people actually type. */
export const sanitizePhone = (value: string): string =>
  value.replace(/[^\d\s()+-]/g, "").slice(0, 20);

export const isValidPhone = (value: string): boolean => {
  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS;
};

export const PHONE_ERROR = `Phone number must contain ${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits`;
