export const serverApi: string = `${process.env.REACT_APP_API_URL}`;

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
