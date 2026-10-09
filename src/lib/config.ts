export const serverApi: string = `${process.env.REACT_APP_API_URL}`;

/** Toss Payments client key (결제위젯 연동 키, test_gck_...). Public by design. */
export const tossClientKey: string = process.env.REACT_APP_TOSS_CLIENT_KEY ?? "";

/**
 * Product and member images are stored either as full S3 URLs (new uploads)
 * or as "uploads/..." paths served by the backend (older uploads), so every
 * stored image path goes through here before reaching an <img>.
 */
export const getImageUrl = (path?: string | null): string =>
  path && /^https?:\/\//.test(path) ? path : `${serverApi}/${path}`;

export const Messages = {
  error1: "Something went wrong",
  error2: "Please login first!",
  error3: "Please pulfil all inputs!",
  error4: "Message is empty",
  error5: "Only images with jpeg, jpg, png format allowed",
};
