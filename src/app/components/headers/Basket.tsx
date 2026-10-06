import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, getImageUrl } from "../../../lib/config";
import { sweetFailureProvider } from "../../../lib/sweetAlert";
import { calcTotals } from "../../../lib/utils/price";
import { isUniquePet } from "../../../lib/utils/cart";
import { useGlobals } from "../hooks/useGlobals";
interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember } = useGlobals();
  const history = useHistory();
  const { itemsPrice, shippingCost, totalPrice } = calcTotals(cartItems);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // the order itself is created on the checkout page — this only opens it
  const goToCheckoutHandler = () => {
    handleClose();
    if (!authMember) {
      sweetFailureProvider(Messages.error2, true);
      return;
    }
    history.push("/checkout", { mode: "cart" });
  };
  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCartIcon sx={{ color: "#1f9d76", fontSize: 26 }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
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
        <Stack className={"basket-frame"}>
          <Box className={"all-check-box"}>
            {cartItems.length === 0 ? (
              <div>Cart is empty!</div>
            ) : (
              <Stack flexDirection={"row"}>
                <div>Cart Products:</div>
                <DeleteForeverIcon
                  sx={{ ml: "5px", cursor: "pointer" }}
                  color={"primary"}
                  onClick={() => onDeleteAll()}
                />
              </Stack>
            )}
          </Box>

          <Box className={"orders-main-wrapper"}>
            <Box className={"orders-wrapper"}>
              {cartItems.map((item: CartItem) => {
                const imagePath = getImageUrl(item.image);
                return (
                  <Box className={"basket-info-box"} key={item._id}>
                    <div className={"cancel-btn"}>
                      <CancelIcon
                        color={"primary"}
                        onClick={() => onDelete(item)}
                      />
                    </div>
                    <img
                      src={imagePath}
                      className={"product-img"}
                      alt={item.name}
                    />
                    <span className={"product-name"}>{item.name}</span>
                    <p className={"product-price"}>
                      {item.quantity} x {item.price}
                    </p>
                    {/* animals come one to a listing — no stepper for them */}
                    <Box sx={{ minWidth: 120 }}>
                      {!isUniquePet(item) && (
                        <div className="col-2">
                          <button
                            onClick={() => onRemove(item)}
                            className="remove"
                          >
                            -
                          </button>{" "}
                          <button onClick={() => onAdd(item)} className="add">
                            +
                          </button>
                        </div>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          {cartItems.length !== 0 ? (
            <Box className={"basket-order"}>
              <span className={"price"}>
                Total: ₩{totalPrice.toFixed(1)} ({itemsPrice} + {shippingCost})
              </span>
              <Button
                onClick={goToCheckoutHandler}
                startIcon={<ShoppingCartIcon />}
                variant={"contained"}
              >
                Checkout
              </Button>
            </Box>
          ) : (
            ""
          )}
        </Stack>
      </Menu>
    </Box>
  );
}
