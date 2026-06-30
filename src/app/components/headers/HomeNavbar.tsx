import { Box, Button, Container, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../hooks/useGlobals";
import Basket from "./Basket";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";

interface HomeNavbarProps {
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

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setLoginOpen,
    setSignupOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  // Smart Search: scroll to the hero smart-search block on the homepage
  const handleSmartSearch = () => {
    const block = document.getElementById("smart-search");
    if (block) block.scrollIntoView({ behavior: "smooth" });
  };

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
          <Box className={"hover-line"}>
            <NavLink exact to="/" activeClassName={"underline"}>
              Home
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <NavLink to="/products?collection=DOG" activeClassName={"underline"}>
              Dogs
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <NavLink to="/products?collection=CAT" activeClassName={"underline"}>
              Cats
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <NavLink to="/helpers" activeClassName={"underline"}>
              Helpers
            </NavLink>
          </Box>
          <Box className={"hover-line"}>
            <a onClick={handleSmartSearch}>Smart Search</a>
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
                  ? `${serverApi}/${authMember?.memberImage}`
                  : "/icons/default-user.svg"
              }
              aria-haspopup={"true"}
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
