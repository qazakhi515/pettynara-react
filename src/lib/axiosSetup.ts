import axios from "axios";

/**
 * Global axios configuration for authenticated requests.
 *
 * Auth in this project is cookie-based: the backend sets an `accessToken`
 * cookie on login and reads it (via `req.cookies`) on every protected route.
 * For the cookie to travel with each request the browser must send credentials.
 * Setting it here guarantees no request ever forgets `withCredentials`.
 */
axios.defaults.withCredentials = true;

/**
 * Attach the access token as a Bearer header on every request.
 *
 * Note: the current backend authenticates from the `accessToken` cookie only
 * (`req.cookies`), so this header is a harmless no-op for it today. It is kept
 * so that if a protected route is later updated to also read the Authorization
 * header, existing sessions keep working.
 */
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Keep the frontend auth state in sync with the real backend session.
 *
 * `authMember` is restored from `localStorage.memberData`, which never expires,
 * while the `accessToken` cookie expires after AUTH_TIMER hours. When the cookie
 * is gone the backend replies 401 "You are not authenticated, Please login
 * first" even though the UI still looks logged in — which is exactly the error
 * seen when paying/ordering. On that 401 we drop the stale local session so the
 * next navigation/refresh reflects the logged-out state (ContextProvider reads
 * the missing cookie and clears authMember). We deliberately do NOT force a
 * page reload here — doing so from inside a global interceptor can loop and
 * leave the screen blank.
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const wasLoggedIn = Boolean(localStorage.getItem("memberData"));

    if (status === 401 && wasLoggedIn) {
      localStorage.removeItem("memberData");
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  },
);
