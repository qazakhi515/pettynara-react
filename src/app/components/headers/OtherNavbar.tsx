import { Logout } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { collectionIsActive } from "../../../lib/utils/nav";
import { getImageUrl } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../hooks/useGlobals";
import Basket from "./Basket";
import MobileNav from "./MobileNav";

interface OtherNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function OtherNavbar(props: OtherNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  return (
    <div className="pettynara-navbar">
      <Container className="navbar-container">
        <Box className="brand">
          <NavLink to="/" className="brand-link">
            <span className="brand-mark" role="img" aria-label="Pettynara">
              🐶
            </span>
            <span className="brand-name">Pettynara</span>
          </NavLink>
        </Box>
        <Stack className="links">
          {/* the row of links: replaced by the burger drawer on narrow screens */}
          <Box className="nav-links">
          <Box className={"hover-line"}>
            <NavLink exact to="/" activeClassName={"underline"}>
              Home
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <NavLink
              to="/products?collection=DOG"
              activeClassName={"underline"}
              isActive={collectionIsActive(ProductCollection.DOG)}
            >
              Dogs
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <NavLink
              to="/products?collection=CAT"
              activeClassName={"underline"}
              isActive={collectionIsActive(ProductCollection.CAT)}
            >
              Cats
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <NavLink to="/helpers" activeClassName={"underline"}>
              Helpers
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            {/* `exact` is required: without it NavLink treats "/" as a prefix,
                which every path matches, so this link stayed underlined on
                every page — including while a category was selected. */}
            <NavLink exact to="/" activeClassName={"underline"}>
              Smart Search
            </NavLink>
          </Box>
          {authMember ? (
            <Box className={"hover-line"}>
              <NavLink to="/orders" activeClassName={"underline"}>
                Orders
              </NavLink>
            </Box>
          ) : null}
          {authMember ? (
            <Box className={"hover-line"}>
              <NavLink to="/member-page" activeClassName={"underline"}>
                My Page
              </NavLink>
            </Box>
          ) : null}
          </Box>

          <MobileNav
            setLoginOpen={setLoginOpen}
            setSignupOpen={setSignupOpen}
            handleLogoutRequest={handleLogoutRequest}
          />

          <Basket
            cartItems={cartItems}
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
          />

          {!authMember ? (
            <Box className="auth-buttons">
              <Button className="login-button" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
              <Button
                variant="contained"
                className="signup-button"
                onClick={() => setSignupOpen(true)}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <img
              className="user-avatar"
              src={
                authMember?.memberImage
                  ? getImageUrl(authMember?.memberImage)
                  : "/icons/default-user.svg"
              }
              alt="profile"
              onClick={handleLogoutClick}
            />
          )}

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleCloseLogout}
            onClick={handleCloseLogout}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogoutRequest}>
              <ListItemIcon>
                <Logout fontSize="small" style={{ color: "blue" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Container>
    </div>
  );
}
