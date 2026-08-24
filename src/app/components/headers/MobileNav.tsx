import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { collectionIsActive } from "../../../lib/utils/nav";
import { Box, Button, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGlobals } from "../hooks/useGlobals";

interface MobileNavProps {
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutRequest: () => void;
  /** Home page scrolls to the hero block; elsewhere the entry is a link to "/" */
  onSmartSearch?: () => void;
}

/**
 * The navigation links as a slide-in drawer, for viewports too narrow to lay
 * them out in a row. The burger button is hidden on desktop from CSS
 * (`.nav-burger`), so both navbars can render this unconditionally.
 */
export default function MobileNav(props: MobileNavProps) {
  const { setSignupOpen, setLoginOpen, handleLogoutRequest, onSmartSearch } =
    props;
  const { authMember } = useGlobals();
  const [open, setOpen] = useState<boolean>(false);

  const close = () => setOpen(false);

  return (
    <>
      <IconButton
        className={"nav-burger"}
        onClick={() => setOpen(true)}
        aria-label="open menu"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor={"right"}
        open={open}
        onClose={close}
        className={"nav-drawer"}
      >
        <Box className={"nav-drawer-inner"}>
          <Box className={"nav-drawer-head"}>
            <span className={"brand-name"}>Pettynara</span>
            <IconButton onClick={close} aria-label="close menu">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* onClick={close} on the wrapper: every link inside dismisses the
              drawer, so navigating never leaves it hanging open */}
          <Box className={"nav-drawer-links"} onClick={close}>
            <NavLink exact to="/" activeClassName={"underline"}>
              Home
            </NavLink>
            <NavLink
              to="/products?collection=DOG"
              activeClassName={"underline"}
              isActive={collectionIsActive(ProductCollection.DOG)}
            >
              Dogs
            </NavLink>
            <NavLink
              to="/products?collection=CAT"
              activeClassName={"underline"}
              isActive={collectionIsActive(ProductCollection.CAT)}
            >
              Cats
            </NavLink>
            <NavLink to="/helpers" activeClassName={"underline"}>
              Helpers
            </NavLink>
            {onSmartSearch ? (
              <span className={"smart-link"} onClick={onSmartSearch}>
                Smart Search
              </span>
            ) : (
              <NavLink exact to="/" activeClassName={"underline"}>
                Smart Search
              </NavLink>
            )}
            {authMember ? (
              <NavLink to="/orders" activeClassName={"underline"}>
                Orders
              </NavLink>
            ) : null}
            {authMember ? (
              <NavLink to="/member-page" activeClassName={"underline"}>
                My Page
              </NavLink>
            ) : null}
          </Box>

          <Box className={"nav-drawer-foot"}>
            {!authMember ? (
              <>
                <Button
                  className={"login-button"}
                  onClick={() => {
                    close();
                    setLoginOpen(true);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant={"contained"}
                  className={"signup-button"}
                  onClick={() => {
                    close();
                    setSignupOpen(true);
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                className={"login-button"}
                startIcon={<LogoutIcon />}
                onClick={() => {
                  close();
                  handleLogoutRequest();
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
