import React, { ReactNode, useState } from "react";
import { Member } from "../../../../lib/types/member";
import { GlobalContext } from "../../hooks/useGlobals";

/**
 * Read the persisted member without ever throwing.
 *
 * This runs during the very first render, so an exception here unmounts the
 * whole tree and the user gets a blank page with no way back — the stored
 * value has to be treated as untrusted input. A malformed entry is dropped and
 * the session simply starts logged out.
 */
const readStoredMember = (): Member | null => {
  try {
    const raw = localStorage.getItem("memberData");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Member;
    return parsed?._id ? parsed : null;
  } catch (e) {
    console.log("memberData unreadable, clearing:", e);
    localStorage.removeItem("memberData");
    return null;
  }
};

const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth persistence is based on the access token saved to localStorage at
  // login (memberService) and cleared on logout / on a 401 (axiosSetup).
  // This survives a page refresh reliably — unlike reading the cookie, which
  // can be blocked/unreadable and would wrongly log the user out on reload.
  if (!localStorage.getItem("accessToken")) {
    localStorage.removeItem("memberData");
  }

  const [authMember, setAuthMember] = useState<Member | null>(readStoredMember);
  const [orderBuilder, setOrderBuilder] = useState<Date>(new Date());

  return (
    <GlobalContext.Provider
      value={{ authMember, setAuthMember, orderBuilder, setOrderBuilder }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
